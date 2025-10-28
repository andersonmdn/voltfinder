import { z } from 'zod/v4'

// User schemas
export const userSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
})

// Response schemas for API documentation
export const userResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
})

export const userDetailResponseSchema = z.object({
  success: z.boolean(),
  data: userResponseSchema,
})

export const userListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(userResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
})

// Export types
export type User = z.infer<typeof userSchema>
export type CreateUser = z.infer<typeof createUserSchema>
export type UserResponse = z.infer<typeof userResponseSchema>
