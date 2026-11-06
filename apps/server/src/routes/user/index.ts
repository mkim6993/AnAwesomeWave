import { type FastifyPluginAsync } from 'fastify';
import {
  CreateUserSchema,
  type CreateUser,
} from '@AnAwesomeWave/shared';

const userRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<({ Params: { id: string } })>('/:id', async function (request, reply) {
    const { id } = request.params
    
    const party = fastify.prisma.party.findUnique({
      where: {
        id
      }
    })

    return { success: true, party };
  })

  /**
   * Sign Up
   */
  fastify.post<{ Body: CreateUser }>('/sign-up', async function (request, reply) {
    const result = CreateUserSchema.safeParse(request.body)

    if (!result.success) {
      return reply.code(400).send({
        success: false,
        error: 'Validation failed',
        details: result.error.format()
      })
    }

    const user = await fastify.prisma.user.create({
      data: {
        username: result.data.username,
        displayname: result.data.displayname || result.data.username,
      }
    })

    return { success: true, user };
  })
};

export default userRoutes;