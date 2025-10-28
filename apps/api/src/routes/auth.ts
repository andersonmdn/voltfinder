import { HTTP_STATUS } from '@voltfinder/core'
import {
  authLoginSuccessSchema,
  authRefreshSuccessSchema,
  authRegisterSuccessSchema,
  createUserSchema,
  loginSchema,
  refreshTokenSchema,
  standardErrorSchema,
} from '@voltfinder/validations'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function authRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>()

  // Register
  server.post(
    '/register',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        description: 'Create a new user account with email, name and password',
        body: createUserSchema,
        response: {
          201: authRegisterSuccessSchema,
          400: standardErrorSchema,
          409: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const authService = (app as any).authService
        const result = await authService.register(request.body)

        reply.code(HTTP_STATUS.CREATED)
        return {
          success: true,
          data: result.user,
          message: 'User created successfully',
        }
      } catch (error: any) {
        if (error.message === 'EMAIL_IN_USE') {
          reply.code(HTTP_STATUS.CONFLICT)
          return {
            success: false,
            error: 'Email already in use',
            message: 'A user with this email already exists',
          }
        }

        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while creating the user',
        }
      }
    }
  )

  // Login
  server.post(
    '/login',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Login user',
        description: 'Authenticate user with email and password',
        body: loginSchema,
        response: {
          200: authLoginSuccessSchema,
          400: standardErrorSchema,
          401: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const authService = (app as any).authService
        const result = await authService.login(request.body)

        return {
          success: true,
          data: result,
          message: 'Login successful',
        }
      } catch (error: any) {
        if (error.message === 'INVALID_CREDENTIALS') {
          reply.code(HTTP_STATUS.UNAUTHORIZED)
          return {
            success: false,
            error: 'Invalid credentials',
            message: 'Email or password is incorrect',
          }
        }

        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong during login',
        }
      }
    }
  )

  // Refresh Token
  server.post(
    '/refresh',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Refresh access token',
        description: 'Get a new access token using a valid refresh token',
        body: refreshTokenSchema.describe('Schema for refreshing access token using refresh token. aaaaaaaaaaaaaaaa'),
        response: {
          200: authRefreshSuccessSchema,
          400: standardErrorSchema,
          401: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const authService = (app as any).authService
        const { refreshToken } = request.body
        const result = await authService.refresh(refreshToken)

        return {
          success: true,
          data: result,
        }
      } catch (error: any) {
        if (error.message === 'INVALID_REFRESH') {
          reply.code(HTTP_STATUS.UNAUTHORIZED)
          return {
            success: false,
            error: 'Invalid refresh token',
            message: 'The provided refresh token is invalid or expired',
          }
        }

        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while refreshing the token',
        }
      }
    }
  )
}
