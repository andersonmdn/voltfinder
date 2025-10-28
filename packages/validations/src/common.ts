import { z } from 'zod/v4'

// Common schemas
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
})

export const deleteSuccessSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

export const standardErrorSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  message: z.string().optional(),
})

export const standardResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

// Export types
export type IdParam = z.infer<typeof idParamSchema>
export type Pagination = z.infer<typeof paginationSchema>
export type StandardError = z.infer<typeof standardErrorSchema>
