import { type FastifyPluginAsync } from "fastify";
import { BaseEffect } from '../../types/effects';

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
    })

    socket.on('close', () => {
        console.log('client disconnected from operator');
    })
  })
};

export default operatorRoutes;