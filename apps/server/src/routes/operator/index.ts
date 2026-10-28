import { type FastifyPluginAsync } from "fastify";
import { BaseEffect } from '../../types/effects';
import { ConnectionOperation } from'../../types/party_controls';

const operatorRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "this is an operator plugin";
  });

  fastify.get('/manual-mode', { websocket: true }, (socket, req) => {
    console.log('client connected to operator manual-mode websocket');

    socket.on('message', (data) => {
      const parsed: BaseEffect = JSON.parse(data.toString());

      if (
        !parsed.color || typeof parsed.color !== 'string' ||
        !parsed.opacity || typeof parsed.opacity !== 'number' ||
        !parsed.duration || typeof parsed.duration !== 'number'
      ) {
        socket.send(JSON.stringify({ type: 'error', data: 'Invalid effect data' }));
      }

      /** Emit effect to all connected clients */
      const effectToEmit: BaseEffect = parsed;
      for (const client of fastify.websocketServer.clients) {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ type: 'effect', data: effectToEmit }));
        }
      }
      socket.send(JSON.stringify({ type: 'update', data: 'Successfully broadcasting' }));
    });

    socket.on('close', () => {
      console.log('client disconnected from operator');
    })
  });


  /**
   * * Disconnect WS connections
   */
  fastify.post('/disconnect', async (request, reply) => {
    const reqBody = request.body as ConnectionOperation;

    if (reqBody.type !== 'disconnect_all') {
      return reply.code(400).send({
        success: false,
        message: 'Only disconnect_all operation is currently supported'
      });
    }

    let disconnectedCount = 0;

    for (const client of fastify.websocketServer.clients) {
      if (client.readyState === 1) {
        client.close(1000, 'Admin disconnect');
        disconnectedCount++;
      }
    }

    return {
      success: true,
      message: `Disconnected ${disconnectedCount} clients`
    };
  });
};

export default operatorRoutes;