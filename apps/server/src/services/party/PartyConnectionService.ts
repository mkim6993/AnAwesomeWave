import type { WebSocket } from 'ws';

export class PartyConnectionService {
  private connections = new Map<string, Set<WebSocket>>();

  /**
   * use for...
   * 1. Reverse lookup - which party/user socket belongs to
   * 2. Per-user operations - send special message or remove individual connection
   * 3. Connection cleanup - handle disconnections gracefully by knowing who disconnected
   */
  private connectionToProfile = new Map<WebSocket, { partyId: string, userId: string }>();

  addConnection(partyId: string, userId: string, socket: WebSocket) {
    if (!this.connections.has(partyId)) {
      this.connections.set(partyId, new Set<WebSocket>());
    }
    this.connections.get(partyId)!.add(socket);
    this.connectionToProfile.set(socket, { partyId, userId });
  }

  broadcastToParty(partyId: string, event: any) {
    const partyConnections = this.connections.get(partyId);
    if (partyConnections) {
      const message = JSON.stringify(event);
      partyConnections.forEach(socket => {
        if (socket.readyState === 1) { // WebSocket.OPEN
          socket.send(message);
        }
      });
    }
  }

  removeConnection(socket: WebSocket) {
    const profile = this.connectionToProfile.get(socket);
    if (profile) {
      const partyConnections = this.connections.get(profile.partyId);
      if (partyConnections) {
        partyConnections.delete(socket);
        if (partyConnections.size === 0) {
          this.connections.delete(profile.partyId);
        }
      }
      this.connectionToProfile.delete(socket);
    }
  }

  killAllPartyConnections(partyId: string) {
    const partyConnections = this.connections.get(partyId);
    if (partyConnections) {
      partyConnections.forEach(socket => {
        socket.close(1000, 'Party Ended by Organizer');
        this.connectionToProfile.delete(socket);
      });
      this.connections.delete(partyId);
    }
  }

  printEverything() {
    console.log('---------------connections---------------');
    console.log('Map size:', this.connections.size);
    this.connections.forEach((sockets, partyId) => {
      console.log(`Party ${partyId}: ${sockets.size} connections`);
    });
    console.log('');
    console.log('---------------connection to profile---------------');
    console.log('Map size:', this.connectionToProfile.size);
    this.connectionToProfile.forEach((profile, socket) => {
      console.log(`Socket -> Party: ${profile.partyId}, User: ${profile.userId}`);
    });
  }
}

export const partyConnectionService = new PartyConnectionService();