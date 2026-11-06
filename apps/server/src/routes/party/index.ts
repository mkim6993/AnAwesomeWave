import { type FastifyPluginAsync } from 'fastify';
import { type ZodTypeProvider } from '@fastify/type-provider-zod';
import {
  CreatePartySchema,
  type CreateParty,
  JoinPartySchema,
  type JoinParty
} from '@AnAwesomeWave/shared';

const partyRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  // GET /party/:id
  server.get(
    '/:id',
    async (request, reply) => {
      const { id } = request.params as { id: string }
      
      const party = await fastify.prisma.party.findUnique({
        where: { id }
      })

      return { success: true, party };
    }
  )

  /**
   * Create a party
   * - generate unique join code
   * - create and insert Party and Participant entry
   */
  server.post(
    '/create',
    {
      schema: {
        body: CreatePartySchema
      }
    },
    async (request, reply) => {
      const { name, organizerId, status } = request.body as CreateParty;

      // Generate a unique join code (format: ABC123 - 3 letters + 3 numbers)
      const letters = String.fromCharCode(
        65 + Math.floor(Math.random() * 26),
        65 + Math.floor(Math.random() * 26),
        65 + Math.floor(Math.random() * 26)
      );
      const numbers = Math.floor(
        Math.random() * 1000).toString().padStart(3, '0');
      const joinCode = letters + numbers;

      // Create Party and Participant in a transaction
      const { party, participant } = await fastify.prisma.$transaction(
        async (tx) => {
          const party = await tx.party.create({
            data: {
              name,
              organizerId,
              joinCode,
              status // Optional, will use default if not provided
            }
          })
          const participant = await tx.participant.create({
            data: {
              partyId: party.id,
              userId: organizerId,
              role: 'OPERATOR'
            }
          })
          return { party, participant }
        }
      )

      return { success: true, party, participant };
    }
  )

  /**
   * Join party as user/guest
   * - validate join code
   * - check if participant already exists
   * - insert new participant
   */
  server.post(
    '/join',
    {
      schema: {
        body: JoinPartySchema
      }
    }, async (request, reply) => {
      const { userId, guestToken, joinCode } = request.body as JoinParty;

      // Check if we're joining as a guest
      const isGuest = !userId;
      if (isGuest && !guestToken) {
        return reply.code(400).send({
          success: false,
          error: 'No userId or guestToken'
        })
      }

      /**
       * Join Party
       * 1. Query Party via joinCode
       * 2. Check if Participant already exists
       * 3. Insert new Participant
       */
      const { party, participant } = await fastify.prisma.$transaction(
        async (tx) => {
          const party = await tx.party.findUnique({
            where: { joinCode }
          })

          if (!party) {
            return reply.code(404).send({
              success: false,
              error: 'Invalid join code'
            })
          }

          if (party.status === 'ENDED') {
            return reply.code(400).send({
              success: false,
              error: 'Party ended'
            })
          }

          // Check for existing participant based on whether they're a guest or user
          const existing = await tx.participant.findFirst({
            where: {
              partyId: party.id,
              ...(isGuest 
                ? { guestToken }
                : { userId }
              )
            }
          });

          if (existing) {
            return { party, participant: existing };
          }

          const participant = await tx.participant.create({
            data: {
              partyId: party.id,
              userId,
              guestToken,
              role: 'GUEST'
            }
          });

          return { party, participant };
        }
      )

      return { success: true, party, participant };
    }
  )

  fastify.get(
    '/ws',
    {
      websocket: true
    },
    (socket, req) => {
      console.log('client connected to party websocket');

      socket.on('message', (data: { toString: () => string; }) => {
        const message = JSON.parse(data.toString());
        socket.send(JSON.stringify({ type: 'party-update', data: message }));
      })

      socket.on('close', () => {
        console.log('client disonnected from party');
      })
    }
  )
}

export default partyRoutes;