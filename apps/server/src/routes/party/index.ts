import { type FastifyPluginAsync } from 'fastify';
import {
  CreatePartySchema,
  type CreateParty,
  JoinPartySchema,
  type JoinParty,
} from '@AnAwesomeWave/shared';

const partyRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // GET /party
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const { id } = request.params
    
    const party = fastify.prisma.party.findUnique({
      where: {
        id
      }
    })

    return { success: true, party };
  })

  /**
   * Create a party
   * - generate unique join code
   * - create and insert Party and Participant entry
   */
  fastify.post<{ Body: CreateParty }>('/create', async (request, reply) => {
    // Validate request body
    const result = CreatePartySchema.safeParse(request.body)

    // Return bad request
    if (!result.success) {
      return reply.code(400).send({
        success: false,
        error: 'Validation failed',
        details: result.error.format()
      })
    }

    // Generate a unique join code (format: ABC123 - 3 letters + 3 numbers)
    const letters = String.fromCharCode(
      65 + Math.floor(Math.random() * 26),
      65 + Math.floor(Math.random() * 26),
      65 + Math.floor(Math.random() * 26)
    );
    const numbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const joinCode = letters + numbers;

    // Create Party and Participant in a transaction
    const { party, participant } = await fastify.prisma.$transaction(async (tx) => {
      const party = await fastify.prisma.party.create({
        data: {
          name: result.data.name,
          organizerId: result.data.organizerId,
          joinCode,
          status: result.data.status // Optional, will use default if not provided
        }
      })
      const participant = await tx.participant.create({
        data: {
          partyId: party.id,
          userId: result.data.organizerId,
          role: 'OPERATOR'
        }
      })
      return { party, participant }
    })

    return { success: true, party, participant };
  })

  /**
   * Join party as user/guest
   * - validate join code
   * - check if participant already exists
   * - insert new participant
   */
  fastify.post<{ Body: JoinParty }>('/join', async (request, reply) => {
    // Validate request body
    const result = JoinPartySchema.safeParse(request.body)

    // Return bad request
    if (!result.success) {
      return reply.code(400).send({
        success: false,
        error: 'Validation failed',
        details: result.error.format()
      })
    }

    // Check if we're joining as a guest
    const isGuest = result.data.userId ? false : true
    if (isGuest && !result.data.guestToken) {
      return reply.code(400).send({
        success: false,
        error: 'No userId or guestToken',
        details: 'No userId provided'
      })
    }

    /**
     * Join Party
     * 1. Query Party via joinCode
     * 2. Check if Participant already exists
     * 3. Insert new Participant
     */
    const { party, participant } = await fastify.prisma.$transaction(async (tx) => {
      const party = await tx.party.findUnique({
        where: { joinCode: result.data.joinCode }
      })

      if (!party) {
        throw new Error('Invalid join code')
      }

      if (party.status === 'ENDED') {
        throw new Error('This Party ended :(')
      }

      // Check for existing participant based on whether they're a guest or user
      const existing = await tx.participant.findFirst({
        where: {
          partyId: party.id,
          ...(isGuest 
            ? { guestToken: result.data.guestToken }
            : { userId: result.data.userId }
          )
        }
      });

      if (existing) {
        return { party, participant: existing };
      }

      const participant = await tx.participant.create({
        data: {
          partyId: party.id,
          userId: result.data.userId,
          guestToken: result.data.guestToken,
          role: 'GUEST'
        }
      });

      return { party, participant };
    })

    return { success: true, party, participant };
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