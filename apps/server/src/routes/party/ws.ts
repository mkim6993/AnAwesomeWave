import { type FastifyPluginAsync } from 'fastify';

import { partyConnectionService } from '../../services/party/PartyConnectionService.js';

const partyWebSocketRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get(
    '/ws',
    {
      websocket: true,
    },
    (socket) => {
      socket.on('message', (data: { toString: () => string }) => {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case 'register': {
            const success = partyConnectionService.registerConnection(
              message.partyId,
              message.userId,
              socket
            );
            socket.send(
              JSON.stringify({
                type: 'register-response',
                partyId: message.partyId,
                success,
              })
            );
            break;
          }
          case 'broadcast':
            partyConnectionService.broadcastToParty(message.partyId, message.event);
            break;
          case 'kill_all':
            partyConnectionService.killAllPartyConnections(message.partyId);
            break;
          case 'print-stuff':
            partyConnectionService.printEverything();
            break;
        }
      });

      socket.on('close', () => {
        partyConnectionService.removeConnection(socket);
      });
    }
  );
};

export default partyWebSocketRoutes;
