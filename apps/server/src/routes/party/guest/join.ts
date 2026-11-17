import { type FastifyPluginAsync } from 'fastify';
import { type ZodTypeProvider } from '@fastify/type-provider-zod';

import { JoinPartySchema, type JoinParty } from '@AnAwesomeWave/shared';

const partyJoinRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  /**
   * POST (DB)
   * Join party as user/guest
   * - validate join code
   * - check if participant already exists
   * - insert new participant into DB
   */
  server.post(
    '/join',
    {
      schema: {
        body: JoinPartySchema,
      },
    },
    async (request, reply) => {
      const { userId, guestToken, partyId } = request.body as JoinParty;

      // Check if we're joining as a guest
      const isGuest = !userId;
      if (isGuest && !guestToken) {
        return reply.code(400).send({
          success: false,
          error: 'No userId or guestToken',
        });
      }

      /**
       * Join Party
       * 1. Query Party via partyId
       * 2. Check if Participant already exists
       * 3. Insert new Participant
       */
      const { party, participant } = await fastify.prisma.$transaction(async (tx) => {
        const party = await tx.party.findUnique({
          where: { id: partyId },
        });

        if (!party) {
          return reply.code(404).send({
            success: false,
            error: 'Invalid join code',
          });
        }

        if (party.status === 'ENDED') {
          return reply.code(400).send({
            success: false,
            error: 'Party ended',
          });
        }

        // Check for existing participant based on whether they're a guest or user
        const existing = await tx.participant.findFirst({
          where: {
            partyId: party.id,
            ...(isGuest ? { guestToken } : { userId }),
          },
        });

        if (existing) {
          return { party, participant: existing };
        }

        const participant = await tx.participant.create({
          data: {
            partyId: party.id,
            userId,
            guestToken,
            role: 'GUEST',
          },
        });

        return { party, participant };
      });

      return { success: true, party, participant };
    }
  );
};

export default partyJoinRoutes;
