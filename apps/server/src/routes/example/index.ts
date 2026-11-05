import { type FastifyPluginAsync } from 'fastify';
import {
  CreateUserBodySchema,
  type CreateUserBody,
} from '@AnAwesomeWave/shared';

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return 'this is an example'
  });

  // User endpoints
  
  // Create a new user (no body required)
  fastify.post<{ Body: CreateUserBody }>('/user', async function (request, reply) {
    CreateUserBodySchema.parse(request.body);

    const user = await fastify.prisma.user.create({
      data: {}
    });
    return { success: true, user };
  });

  // Get all users with their participants and parties
  fastify.get('/users', async function (request, reply) {
    const users = await fastify.prisma.user.findMany({
      include: {
        participants: {
          include: {
            party: true
          }
        }
      }
    });
    return { success: true, users };
  });

  // Get a specific user by ID
  fastify.get('/user/:id', async function (request, reply) {
    const { id } = request.params as { id: string };
    const user = await fastify.prisma.user.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            party: true
          }
        }
      }
    });
    return { success: true, user };
  });

  // Party endpoints
  
  // Create a party with optional joinCode (auto-generates if not provided)
  fastify.post('/party', async function (request, reply) {
    const { joinCode } = request.body as { joinCode?: string };
    const party = await fastify.prisma.party.create({
      data: {
        joinCode: joinCode || Math.random().toString(36).substring(2, 8).toUpperCase()
      }
    });
    return { success: true, party };
  });

  // Get all parties with their participants and users
  fastify.get('/parties', async function (request, reply) {
    const parties = await fastify.prisma.party.findMany({
      include: {
        participants: {
          include: {
            user: true
          }
        }
      }
    });
    return { success: true, parties };
  });

  // Get a specific party by ID
  fastify.get('/party/:id', async function (request, reply) {
    const { id } = request.params as { id: string };
    const party = await fastify.prisma.party.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: true
          }
        }
      }
    });
    return { success: true, party };
  });

  // Update party status (SCHEDULED, LIVE, or ENDED)
  fastify.patch('/party/:id/status', async function (request, reply) {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: 'SCHEDULED' | 'LIVE' | 'ENDED' };
    const party = await fastify.prisma.party.update({
      where: { id },
      data: { status }
    });
    return { success: true, party };
  });

  // Participant endpoints
  
  // Create a participant (requires partyId, optional userId and role)
  fastify.post('/participant', async function (request, reply) {
    const { partyId, userId, role } = request.body as { 
      partyId: string; 
      userId?: string; 
      role?: 'OPERATOR' | 'GUEST' 
    };
    const participant = await fastify.prisma.participant.create({
      data: {
        partyId,
        userId,
        role: role || 'GUEST'
      },
      include: {
        user: true,
        party: true
      }
    });
    return { success: true, participant };
  });

  // Get all participants with their users and parties
  fastify.get('/participants', async function (request, reply) {
    const participants = await fastify.prisma.participant.findMany({
      include: {
        user: true,
        party: true
      }
    });
    return { success: true, participants };
  });

  // Combo endpoint: Create party with operator
  
  // Create a new party with a user as the operator in one request
  fastify.post('/party-with-operator', async function (request, reply) {
    const { joinCode } = request.body as { joinCode?: string };
    
    // Create user
    const user = await fastify.prisma.user.create({
      data: {}
    });

    // Create party with operator participant
    const party = await fastify.prisma.party.create({
      data: {
        joinCode: joinCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
        participants: {
          create: {
            userId: user.id,
            role: 'OPERATOR'
          }
        }
      },
      include: {
        participants: {
          include: {
            user: true
          }
        }
      }
    });

    return { success: true, party, user };
  });

  // Clean up endpoint for testing
  
  // Delete all participants, parties, and users (for testing only)
  fastify.delete('/cleanup', async function (request, reply) {
    await fastify.prisma.participant.deleteMany({});
    await fastify.prisma.party.deleteMany({});
    await fastify.prisma.user.deleteMany({});
    return { success: true, message: 'All data deleted' };
  });
}

export default example
