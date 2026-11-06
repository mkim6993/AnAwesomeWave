import { type FastifyPluginAsync } from 'fastify';
import { type ZodTypeProvider } from '@fastify/type-provider-zod';
import {
  CreateUserSchema,
  type CreateUser,
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