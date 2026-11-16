import { type FastifyPluginAsync } from 'fastify';
import { type ZodTypeProvider } from '@fastify/type-provider-zod';
import {
  CreatePartySchema,
  type CreateParty,
  EndPartySchema,
  type EndParty
} from '@AnAwesomeWave/shared';
import partyWebSocketRoutes from './ws.js';
import partyJoinRoutes from './guest/join.js';

const partyRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  await server.register(partyJoinRoutes);
  await server.register(partyWebSocketRoutes);

  /**
   * GET
   * party by id
   */
  server.get(
    '/:id',
    async (request, reply) => {
      const { id } = request.params as { id: string }
      
      const party = await fastify.prisma.party.findUnique({
        where: { id }
      })

      if (!party) {
        return reply.code(404).send({
          success: false,
          error: 'Party not found'
        })
      }

      return { success: true, party };
    }
  )

  /**
   * GET
   * party by join code
   */
  server.get(
    '/by-join-code/:code',
    async (request, reply) => {
      const { code } = request.params as { code: string }
      const party = await fastify.prisma.party.findUnique({
        where: { joinCode: code }
      })

      if (!party) {
        return reply.code(404).send({
          success: false,
          error: 'Party not found'
        })
      }
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
   * End party
   * - validate userId matches organizerId
   * - delete party from database (cascade deletes participants)
   */
  server.delete(
    '/end',
    {
      schema: {
        body: EndPartySchema
      }
    },
    async (request, reply) => {
      const { partyId, userId } = request.body as EndParty;
      console.log('/party/end', partyId, userId);

      // First, find the party and verify the organizer
      const party = await fastify.prisma.party.findUnique({
        where: { id: partyId }
      });

      if (!party) {
        return reply.code(404).send({
          success: false,
          error: 'Party not found'
        });
      }

      // Check if the userId matches the organizerId
      if (party.organizerId !== userId) {
        return reply.code(403).send({
          success: false,
          error: 'Only the organizer can end the party'
        });
      }

      // Delete the party (participants will be cascade deleted)
      await fastify.prisma.party.delete({
        where: { id: partyId }
      });

      return { 
        success: true, 
        message: 'Party ended successfully' 
      };
    }
  );
}

export default partyRoutes;