import { useEffect, useState } from 'react';
import { Button, Dimensions, ScrollView, Text, View } from 'react-native';

import { useDisconnectAll } from '@/hooks/api/useOperator';
import { usePartyWebSocket } from '@/hooks/useWebSocket';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const partyOperatorWSURL = 'ws://127.0.0.1:3000/operator/manual-mode'

const sampleColors = [
    '#273CF5',
    '#F53C68',
    '#F5C33C',
    '#3CF54D',
    '#A53CF5',
    '#F57E3C',
    '#3CF5C3',
    '#F53C9D',  
    '#3C7EF5',
    '#F53C3C'
];


const Dashboard = () => {
  const router = useRouter();
  const {
    connect,
    disconnect,
    sendMessage,
    connected,
    lastMessage
  } = usePartyWebSocket(partyOperatorWSURL);
  const [messageLog, setMessageLog] = useState<String[]>([]);
  
  // React Query mutation hook
  const disconnectAllMutation = useDisconnectAll();

  const sendSomeMessage = () => {
    const randomColor = sampleColors[Math.floor(Math.random() * sampleColors.length)];
    const randomOpacity = Math.random() * 0.9 + 0.1; // 0.1 to 1.0
    const randomDuration = Math.floor(Math.random() * 2001) + 1000; // 1000 to 3000
    
    sendMessage({
        color: randomColor,
        opacity: randomOpacity,
        duration: randomDuration
    });
  };

//   useEffect(() => {
//     const interval = setInterval(() => {
//         sendSomeMessage();
//     }, 1500);

//     return () => clearInterval(interval);
//   }, []);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageLog(log => [...log, lastMessage]);
    }
  }, [lastMessage]);

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

      <View
        style={{
          width,
          height: width,
          backgroundColor: 'black',
        }}
      />

      <Button
        title='Send WS message'
        onPress={() => sendSomeMessage()}
      />
      <Button
        title='Disconnect All Clients'
        onPress={() => disconnectAllMutation.mutate()}
        disabled={disconnectAllMutation.isPending}
      />
      {disconnectAllMutation.isSuccess && (
        <Text style={{ color: 'green', padding: 10 }}>
          {disconnectAllMutation.data.message}
        </Text>
      )}
      {disconnectAllMutation.isError && (
        <Text style={{ color: 'red', padding: 10 }}>
          Error: {disconnectAllMutation.error.message}
        </Text>
      )}
      <Button
        title='go back home'
        onPress={() => router.back()}
      />

      <View>
        <Text>
          {JSON.stringify(messageLog, null, 2)}
        </Text>
      </View>
    </ScrollView>
  )
}

export default Dashboard;