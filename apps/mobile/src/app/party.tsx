import { useEffect, useRef, useState } from 'react';
import { Button, Dimensions, ScrollView, Text, View } from 'react-native';

import { usePartyWebSocket } from '@/hooks/useWebSocket';
import { useRouter } from 'expo-router';

import { BaseEffect } from '@/types/effects';

const { width, height } = Dimensions.get('window');
const partyWSURL = 'ws://127.0.0.1:3000/party/ws';
const defPresentationColor = 'white';
const defPresentationOpacity = 1;


const Test = () => {
  const router = useRouter();
  const {
    connect,
    disconnect,
    connected,
    lastMessage
  } = usePartyWebSocket(partyWSURL);
  const [messageLog, setMessageLog] = useState<String[]>([]);

  /**
   * Lighting effects
   */
  const presentationQueue = useRef<BaseEffect[]>([]);
  const displayActive = useRef<Boolean>(false);
  const [presentationColor, setPresentationColor] = useState<string>(defPresentationColor);
  const [presentationOpacity, setPresentationOpacity] = useState<number>(defPresentationOpacity);
  const [presentationMeta, setPresentationMeta] = useState<{ duration: number; queueCount: number }>({ duration: 0, queueCount: 0 });

  const updateMeta = () => {
    /** record meta */
    const totalDuration = presentationQueue.current.reduce((sum, effect) => sum + (effect.duration ?? 0), 0);
    setPresentationMeta({ duration: totalDuration, queueCount: presentationQueue.current.length });
  }

  const executeEffect = async (effect: BaseEffect): Promise<void> => {
    try {
      /** set color + opacity for x duration according to effect item */
      setPresentationColor(effect.color);
      setPresentationOpacity(effect.opacity);
      await new Promise(resolve => setTimeout(resolve, effect.duration));
    } catch (error) {
      console.error('Error in executeEffect():', error);
    } finally {
      /** reset to default after completion */
      setPresentationColor(defPresentationColor);
      setPresentationOpacity(defPresentationOpacity);
      updateMeta();
    }
  }

  const processPresentationQueue = async (): Promise<void> => {
    displayActive.current = true;
    try {
      while (true) {
        /** Exit early if queue is empty */
        const queueLength = presentationQueue.current.length;
        if (queueLength === 0) break;

        /** Pop effect item at start of queue */
        const effect = presentationQueue.current.shift();
        if (effect) {
          await executeEffect(effect);
        }
      }
    } catch (error) {
      console.error('Error in processPresentationQueue():', error);
    } finally {
      displayActive.current = false;
    }
  }

  useEffect(() => {
    if (lastMessage !== null) {
      /** insert incoming effect events to queue */
      if (lastMessage.type === 'effect') {
        presentationQueue.current.push(lastMessage.data);
        updateMeta();
        
        if (!displayActive.current) {
          processPresentationQueue();
        }
      }

      /** log all messages */
      setMessageLog(log => [...log, lastMessage]);
    }
  }, [lastMessage]);

  /**
   * Start up useEffect
   */
  useEffect(() => {
    connect();
    

    return () => {
      disconnect();
    }
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
      }}
      style={{
        flex: 1,
        gap: 10,
      }}
    >
      <View
        style={{
          backgroundColor: connected ? 'green' : 'red',
          alignItems: 'center',
          justifyContent: 'center',
          width,
          padding: 10,
        }}
      >
        <Text style={{ color: 'white' }}>{connected ? 'Connected' : 'Disconnected'}</Text>
      </View>

      {/* Client */}
      <View
        style={{
          width,
          height: width,
          backgroundColor: presentationColor,
          opacity: presentationOpacity
        }}
      />
      <Text>
        Queue: {presentationMeta.queueCount} | Duration: {presentationMeta.duration}
      </Text>

      <Button
        title='go back home'
        onPress={() => router.navigate('/')}
      />
      <Button
        title='operator'
        onPress={() => router.navigate('/operator')}
      />
      <Button
        title='log effect queue'
        onPress={() => console.log(presentationQueue.current)}
      />
      <Button
        title='reconnect'
        onPress={() => connect()}
      />
      <Button
        title='disconnect'
        onPress={() => disconnect()}
      />
      <View>
        <Text>
          {JSON.stringify(messageLog, null, 2)}
        </Text>
      </View>
    </ScrollView>
  )
}

export default Test;