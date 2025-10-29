import { z } from 'zod/v4'
import { standardResponseSchema } from './common'
import { userSchema } from './user'

// Auth schemas
export const loginSchema = userSchema
  .pick({
    email: true,
    password: true,
  })
  .strict()
  .describe('Schema for user login credentials.')

export const tokenSchema = z
  .object({
    token: z.string().describe('JWT access token.'),
    refreshToken: z.string().describe('JWT refresh token.'),
  })
  .describe('Schema for authentication tokens.')

export const refreshTokenSchema = tokenSchema
  .pick({
    refreshToken: true,
  })
  .describe('Schema for refresh token request.')

// Response schemas
export const authSuccessResponseSchema = standardResponseSchema
  .pick({
    success: true,
  })
  .extend({
    data: tokenSchema
      .pick({
        token: true,
        refreshToken: true,
      })
      .extend({
        user: userSchema.pick({
          id: true,
          email: true,
          name: true,
        }),
      }),
  })
  .describe('Schema for successful authentication response.')

export const authRegisterSuccessSchema = standardResponseSchema
  .pick({
    success: true,
    message: true,
  })
  .extend({
    data: userSchema.pick({
      id: true,
      email: true,
      name: true,
    }),
  })
  .describe('Schema for successful user registration response.')

export const authLoginSuccessSchema = authSuccessResponseSchema

export const authRefreshSuccessSchema = standardResponseSchema
  .pick({
    success: true,
  })
  .extend({
    data: tokenSchema.pick({
      token: true,
      refreshToken: true,
    }),
  })
  .describe('Schema for successful token refresh response.')

// Compatibility aliases
export const RegisterSchema = userSchema
  .pick({
    email: true,
    name: true,
    password: true,
  })
  .strict()
  .describe('Schema for user registration.')

export const LoginSchema = loginSchema

// Export types
export type Login = z.infer<typeof loginSchema>
export type Token = z.infer<typeof tokenSchema>
export type RegisterBody = z.infer<typeof RegisterSchema>
export type LoginBody = z.infer<typeof LoginSchema>
export type AuthSuccessResponse = z.infer<typeof authSuccessResponseSchema>
