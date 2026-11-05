import fp from 'fastify-plugin'
import cors, { FastifyCorsOptions } from '@fastify/cors'

/**
 * This plugin enables CORS for cross-origin requests
 * @see https://github.com/fastify/fastify-cors
 */
export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    // Allow requests from Expo dev server
    origin: [
      'http://localhost:8081',  // Expo web default
      'http://127.0.0.1:8081',
      'http://localhost:19006', // Expo web alternative port
      'http://127.0.0.1:19006',
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:8081$/, // Allow local network IPs (Expo on physical device/emulator)
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:19006$/, // Allow local network IPs (Expo web on local network)
    ],
    // Allow credentials (cookies, authorization headers)
    credentials: true,
    // Allow common HTTP methods
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    // Allow common headers
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
})
