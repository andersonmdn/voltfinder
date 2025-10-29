import { z } from 'zod'

export const idParamSchema = z
  .object({
    id: z.coerce.number().int().positive().describe('The unique identifier as a positive integer.'),
  })
  .describe('Schema for ID parameter validation.')

export const standardResponseSchema = z
  .object({
    success: z.boolean().describe('Indicates if the request was successful.'),
    message: z.string().optional().describe('Optional response message.'),
  })
  .describe('Standard response schema for API responses.')

export const paginationSchema = z
  .object({
    page: z.coerce.number().int().positive().default(1).describe('The page number (starts from 1).'),
    limit: z.coerce.number().int().positive().max(100).default(10).describe('The number of items per page (maximum 100).'),
  })
  .describe('Schema for pagination parameters.')

export const deleteSuccessSchema = standardResponseSchema
  .pick({
    success: true,
    message: true,
  })
  .describe('Schema for successful deletion response.')

export const standardErrorSchema = standardResponseSchema
  .pick({
    success: true,
    message: true,
  })
  .extend({
    error: z.string().describe('Error message describing the failure.'),
  })
  .describe('Schema for standard error responses.')

export const standardResponsePaginationSchema = z
  .object({
    page: z.number().int().positive().describe('Current page number.'),
    limit: z.number().int().positive().describe('Number of items per page.'),
    total: z.number().int().nonnegative().describe('Total number of items.'),
    totalPages: z.number().int().positive().describe('Total number of pages.'),
  })
  .describe('Pagination details for paginated responses.')

// Export types
export type IdParam = z.infer<typeof idParamSchema>
export type Pagination = z.infer<typeof paginationSchema>
export type StandardError = z.infer<typeof standardErrorSchema>
