import { type FastifyPluginAsync } from 'fastify';

const partyRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // GET /party
    fastify.get('/', async (request, reply) => {
        return { parties: ['Jordan', 'Tex', 'Baymax'] }
    })

    // GET /party/:id - Get specific party
    fastify.get('/:id', async (request, reply) => {
        const { id } = request.params as { id: string }
        return { id, name: 'Party Name' }
    })

    fastify.get('/ws', { websocket: true }, (socket, req) => {
        console.log('client connected to party websocket');

        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());
            socket.send(JSON.stringify({ type: 'party-update', data: message }));
        })

        socket.on('close', () => {
            console.log('client disonnected from party');
        })
    })
}

export default partyRoutes;