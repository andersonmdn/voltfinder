import { z } from 'zod/v4'
import { standardResponsePaginationSchema, standardResponseSchema } from './common'

// User schemas
export const userSchema = z
  .object({
    id: z.number().int().positive().describe('The unique identifier of the user.'),
    email: z.string().email().describe('The email address of the user.'),
    name: z.string().min(1).describe('The name of the user.'),
    password: z.string().min(6).describe('The password of the user.'),
    createdAt: z.date().describe('The date and time when the user was created.'),
    updatedAt: z.date().describe('The date and time when the user was last updated.'),
  })
  .describe('Schema representing a user.')

export const createUserSchema = userSchema
  .pick({
    email: true,
    name: true,
    password: true,
  })
  .describe('Schema for creating a new user.')

// Response schemas for API documentation
export const userResponseSchema = userSchema
  .pick({
    id: true,
    email: true,
    name: true,
  })
  .describe('Schema representing a user response.')

export const userDetailResponseSchema = standardResponseSchema
  .pick({
    success: true,
  })
  .extend({
    data: userResponseSchema,
  })
  .describe('Schema for user detail response.')

export const userListResponseSchema = z
  .object({
    success: z.boolean().describe('Indicates if the request was successful.'),
    data: z.array(userResponseSchema),
    pagination: standardResponsePaginationSchema,
  })
  .describe('Schema for user list response.')

// Export types
export type User = z.infer<typeof userSchema>
export type CreateUser = z.infer<typeof createUserSchema>
export type UserResponse = z.infer<typeof userResponseSchema>
