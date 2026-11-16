import { BaseEffect } from '@AnAwesomeWave/shared';
import { useEffect, useRef, useState } from 'react';

// const WS_URL = 'ws://127.0.0.1:3000/party/ws';

export const usePartyWebSocket = (
  url: string,
  partyId: string,
  userId: string,
) => {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const ws = useRef<WebSocket | null>(null);

  const isConnected = (): boolean => {
    return ws.current?.readyState === WebSocket.OPEN || false;
  }

  /**
   * Establish connection with ws address
   * @param url 
   * @returns 
   */
  const connect = (): boolean => {
    try {
      if (!url) throw new Error(`Invalid url provided: ${url}`);

      // Prevent duplicate connections
      if (
        isConnected() ||
        ws.current?.readyState === WebSocket.CONNECTING
      ) {
        console.log('Already connected or connecting');
        return true;
      }

      // Close existing connection if in CLOSING or broken state
      if (ws.current?.readyState === WebSocket.CLOSING) {
        ws.current.close();
      }

      ws.current = new WebSocket(url);

      // Called when connection is established
      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);

        sendMessage({
          type: 'register',
          partyId,
          userId,
        })
      };

      // Called when a message is received from the server
      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === 'register-response') {
          if (!message.success) {
            console.log('Registration failed, retrying');
            setTimeout(() => {
              sendMessage({
                type: 'register',
                partyId,
                userId,
              })
            }, 3000);
          } else {
            console.log('Registration success!')
          }
        }
      };

      // Called when an error occurs
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      // Called when connection is closed
      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        ws.current = null; // Clear ref
      };

      return true;
    } catch (error) {
      console.error('Error in connect():', error);
      return false;
    }
  }

  const disconnect = (): boolean => {
    try {
      if (
        ws.current &&
        (
          isConnected() ||
          ws.current?.readyState === WebSocket.CONNECTING
        )
      ) {
        ws.current.close();
      }
      return true;
    } catch (error) {
      console.error('Error in disconnect:', error); 
      return false;
    }
  }

  const sendMessage = (data: any) => {
    console.log('calling send message.\nws.current.readyState?', ws.current?.readyState, 'WebSocket.OPEN', WebSocket.OPEN);
    if (isConnected()) {
      ws.current!.send(JSON.stringify(data));
    }
  };

  useEffect(() => {
    // Cleanup: close connection when component unmounts
    return () => {
      ws.current?.close();
    };
  }, []);
  
  return {
    connect,
    disconnect,
    isConnected,
    sendMessage,
    connected,
    lastMessage,
  };
}