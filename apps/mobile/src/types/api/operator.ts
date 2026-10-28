/**
 * Operator API Types
 * Admin controls for WebSocket connections and lighting events
 */

export interface DisconnectAllRequest {
  type: 'disconnect_all';
}

export interface DisconnectAllResponse {
  success: boolean;
  message: string;
}

// Future operator types:
// export interface Connection { ... }
// export interface LightingEvent { ... }
