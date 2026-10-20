import fp from 'fastify-plugin';
import webSockets, { WebsocketPluginOptions } from '@fastify/websocket';

export default fp<WebsocketPluginOptions>(async (fastify, opts) => {
    await fastify.register(webSockets, {
        ...opts,
        options: {
            maxPayload: 1048576,
            ...opts.options
        }
    })
}, {
    name: 'websocket-plugin'
})