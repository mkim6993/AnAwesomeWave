import { useMutation } from '@tanstack/react-query';
import { operatorApi } from '@/api/operator';
import { DisconnectAllResponse } from '@AnAwesomeWave/shared';

/**
 * Operator React Query Hooks
 * Admin controls for WebSocket connections and lighting events
 */

/**
 * Mutation hook to disconnect all WebSocket clients
 */
export const useDisconnectAll = () => {
  return useMutation<DisconnectAllResponse, Error>({
    mutationFn: operatorApi.disconnectAll,
    onSuccess: (data) => {
      console.log('✅ Disconnected clients:', data.message);
    },
    onError: (error) => {
      console.error('❌ Failed to disconnect clients:', error.message);
    },
  });
};

// Future operator hooks:
// export const useGetConnections = () => { ... }
// export const useSendLightingEvent = () => { ... }
