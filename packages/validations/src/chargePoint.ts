import { z } from 'zod/v4'
import { standardResponseSchema } from './common'

// ChargePoint enums
export const chargePointTypeSchema = z.enum(['TYPE1', 'TYPE2', 'CCS', 'CHAdeMO', 'TESLA_SUPERCHARGER']).describe('Type of charging connector.')
export const chargePointStatusSchema = z.enum(['BUSY', 'FREE', 'CLOSED', 'MAINTENANCE']).describe('Status of the charge point.')

// ChargePoint schemas
const chargePointSchema = z
  .object({
    id: z.number().int().positive().describe('The unique identifier of the charge point.'),
    stationId: z.number().int().positive().describe('The unique identifier of the station this charge point belongs to.'),
    type: chargePointTypeSchema.describe('The type of charging connector.'),
    powerKW: z.number().positive().max(1000).describe('The power output in kilowatts.'),
    pricePerKwh: z.number().min(0).describe('The price per kilowatt hour.'),
    status: chargePointStatusSchema.describe('The current status of the charge point.'),
    createdAt: z.date().describe('The date and time when the charge point was created.'),
    updatedAt: z.date().describe('The date and time when the charge point was last updated.'),
  })
  .describe('Schema representing a charge point.')

export const createChargePointSchema = chargePointSchema
  .pick({
    stationId: true,
    type: true,
    powerKW: true,
    pricePerKwh: true,
  })
  .extend({
    status: chargePointStatusSchema.default('FREE').optional(),
  })
  .strict()
  .describe('Schema for creating a new charge point.')

export const updateChargePointSchema = chargePointSchema
  .pick({
    stationId: true,
    type: true,
    powerKW: true,
    pricePerKwh: true,
    status: true,
  })
  .partial()
  .strict()
  .describe('Schema for updating an existing charge point.')

export const updateChargePointStatusSchema = z
  .object({
    status: chargePointStatusSchema.describe('The new status of the charge point.'),
  })
  .strict()
  .describe('Schema for updating charge point status.')

// ChargePoint response schemas
export const chargePointResponseSchema = chargePointSchema
  .pick({
    id: true,
    stationId: true,
    type: true,
    powerKW: true,
    pricePerKwh: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  })
  .describe('Schema representing a charge point response.')

export const chargePointWithStationResponseSchema = chargePointResponseSchema
  .extend({
    station: z
      .object({
        id: z.number(),
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        address: z.string(),
        workingHours: z.string(),
      })
      .describe('Station information for this charge point.'),
  })
  .describe('Schema representing a charge point with station information.')

export const chargePointSuccessResponseSchema = standardResponseSchema
  .pick({
    success: true,
    message: true,
  })
  .extend({
    data: chargePointWithStationResponseSchema,
  })
  .describe('Schema for successful charge point operation response.')

export const chargePointListResponseSchema = standardResponseSchema
  .pick({
    success: true,
  })
  .extend({
    data: z.array(chargePointWithStationResponseSchema),
    pagination: z.object({
      page: z.number().describe('Current page number.'),
      limit: z.number().describe('Number of items per page.'),
      total: z.number().describe('Total number of items.'),
      totalPages: z.number().describe('Total number of pages.'),
    }),
  })
  .describe('Schema for charge point list response.')

// Export types
export type ChargePoint = z.infer<typeof chargePointSchema>
export type CreateChargePoint = z.infer<typeof createChargePointSchema>
export type UpdateChargePoint = z.infer<typeof updateChargePointSchema>
export type UpdateChargePointStatus = z.infer<typeof updateChargePointStatusSchema>
export type ChargePointResponse = z.infer<typeof chargePointResponseSchema>
export type ChargePointWithStationResponse = z.infer<typeof chargePointWithStationResponseSchema>
export type ChargePointSuccessResponse = z.infer<typeof chargePointSuccessResponseSchema>
export type ChargePointListResponse = z.infer<typeof chargePointListResponseSchema>
export type ChargePointType = z.infer<typeof chargePointTypeSchema>
export type ChargePointStatus = z.infer<typeof chargePointStatusSchema>
