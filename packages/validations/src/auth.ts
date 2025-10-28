import { z } from 'zod/v4'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const tokenSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
})

// Response schemas
export const authSuccessResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    user: z.object({
      id: z.number(),
      email: z.string(),
      name: z.string(),
    }),
    token: z.string(),
    refreshToken: z.string(),
  }),
  message: z.string().optional(),
})

export const authRegisterSuccessSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
  }),
  message: z.string().optional(),
})

export const authLoginSuccessSchema = authSuccessResponseSchema

export const authRefreshSuccessSchema = z.object({
  success: z.boolean(),
  data: z.object({
    token: z.string(),
    refreshToken: z.string(),
  }),
})

// Compatibility aliases
export const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
})

export const LoginSchema = loginSchema

// Export types
export type Login = z.infer<typeof loginSchema>
export type Token = z.infer<typeof tokenSchema>
export type RegisterBody = z.infer<typeof RegisterSchema>
export type LoginBody = z.infer<typeof LoginSchema>
export type AuthSuccessResponse = z.infer<typeof authSuccessResponseSchema>
