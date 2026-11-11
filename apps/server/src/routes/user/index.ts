import { type FastifyPluginAsync } from 'fastify';
import { type ZodTypeProvider } from '@fastify/type-provider-zod';
import {
  CreateUserSchema,
  type CreateUser,
  type GetUserPartiesResponse,
} from '@AnAwesomeWave/shared';

const userRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  // GET /user/:id
  server.get(
    '/:id',
    async (request, reply) => {
      const { id } = request.params as { id: string }
      
      const user = await fastify.prisma.user.findUnique({
        where: { id }
      })

      return { success: true, user };
    }
  )

  /**
   * Get all parties for a user
   * Returns all parties the user is participating in (as organizer or guest)
   */
  server.get(
    '/:id/parties',
    async (request, reply): Promise<GetUserPartiesResponse> => {
      const { id } = request.params as { id: string }

      // Find all participations for this user, including party details
      const participations = await fastify.prisma.participant.findMany({
        where: { userId: id },
        include: {
          party: {
            include: {
              organizer: {
                select: {
                  id: true,
                  username: true,
                  displayname: true
                }
              },
              _count: {
                select: {
                  participants: true
                }
              }
            }
          }
        },
        orderBy: {
          joinedAt: 'desc' // Most recently joined first
        }
      })

      // Transform the data for homescreen display
      const parties = participations.map(participation => ({
        id: participation.party.id,
        name: participation.party.name,
        status: participation.party.status,
        joinCode: participation.party.joinCode,
        createdAt: participation.party.createdAt,
        organizer: participation.party.organizer,
        participantCount: participation.party._count.participants,
        userRole: participation.role,
        joinedAt: participation.joinedAt,
        isOrganizer: participation.party.organizerId === id
      }))

      return { success: true, parties };
    }
  )

  /**
   * Sign Up
   */
  server.post(
    '/sign-up',
    {
      schema: {
        body: CreateUserSchema
      }
    }, async (request, reply) => {
      const { username, displayname } = request.body as CreateUser;

      const user = await fastify.prisma.user.create({
        data: {
          username,
          displayname: displayname || username,
        }
      })

      return { success: true, user };
    }
  )
};

export default userRoutes;