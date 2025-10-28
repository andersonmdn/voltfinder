import { HTTP_STATUS } from '@voltfinder/core'
import { idParamSchema, paginationSchema, standardErrorSchema, userDetailResponseSchema, userListResponseSchema } from '@voltfinder/validations'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function userRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>()

  // Get user profile (protected route)
  server.get(
    '/me',
    {
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify()
        } catch (err) {
          reply.code(HTTP_STATUS.UNAUTHORIZED)
          return {
            success: false,
            error: 'Unauthorized',
            message: 'Valid authentication token required',
          }
        }
      },
      schema: {
        tags: ['Users'],
        summary: 'Get current user profile',
        description: 'Get the profile information of the currently authenticated user',
        security: [{ Bearer: [] }],
        response: {
          200: userDetailResponseSchema,
          401: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const authService = (app as any).authService
        const userId = (request.user as any)?.userId

        if (!userId) {
          reply.code(HTTP_STATUS.UNAUTHORIZED)
          return {
            success: false,
            error: 'Unauthorized',
            message: 'User ID not found in token',
          }
        }

        const user = await authService.getUserById(userId)

        return {
          success: true,
          data: {
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          },
        }
      } catch (error: any) {
        if (error.message === 'USER_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'User not found',
            message: 'The requested user does not exist',
          }
        }

        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while fetching user data',
        }
      }
    }
  )

  // Get user by ID
  server.get(
    '/:id',
    {
      schema: {
        tags: ['Users'],
        summary: 'Get user by ID',
        description: 'Get user information by their unique identifier',
        params: idParamSchema,
        response: {
          200: userDetailResponseSchema,
          400: standardErrorSchema,
          404: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const userService = (app as any).userService
        const { id } = request.params

        const user = await userService.getUserById(id)

        return {
          success: true,
          data: {
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          },
        }
      } catch (error: any) {
        if (error.message === 'USER_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'User not found',
            message: 'The requested user does not exist',
          }
        }

        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while fetching user data',
        }
      }
    }
  )

  // List users with pagination
  server.get(
    '/',
    {
      schema: {
        tags: ['Users'],
        summary: 'List users',
        description: 'Get a paginated list of all users',
        querystring: paginationSchema,
        response: {
          200: userListResponseSchema,
          400: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const userService = (app as any).userService
        const { page, limit } = request.query

        const result = await userService.getUsersList(page, limit)

        return {
          success: true,
          data: result.users.map((user: any) => ({
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          })),
          pagination: result.pagination,
        }
      } catch (error) {
        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while fetching users',
        }
      }
    }
  )
}
