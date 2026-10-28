import { fetchApi } from './client';
import { DisconnectAllRequest, DisconnectAllResponse } from '@/types/api/operator';

/**
 * Operator API - Admin controls for WebSocket connections and lighting events
 */
export const operatorApi = {
  /**
   * Disconnect all connected WebSocket clients
   */
  disconnectAll: () =>
    fetchApi<DisconnectAllResponse>('/operator/disconnect', {
      method: 'POST',
      body: JSON.stringify({ 
        type: 'disconnect_all' 
      } as DisconnectAllRequest),
    }),

  // Future operator endpoints:
  // getConnections: () => fetchApi<Connection[]>('/operator/connections'),
  // sendLightingEvent: (event: LightingEvent) => fetchApi('/operator/lighting', { method: 'POST', body: JSON.stringify(event) }),
};
