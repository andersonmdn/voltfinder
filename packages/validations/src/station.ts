import { z } from 'zod/v4'
import { standardResponseSchema } from './common'

// Station schemas
const stationSchema = z
  .object({
    id: z.number().int().positive().describe('The unique identifier of the station.'),
    name: z.string().min(1).max(255).describe('The name of the charging station.'),
    latitude: z.number().min(-90).max(90).describe('The latitude coordinate of the station.'),
    longitude: z.number().min(-180).max(180).describe('The longitude coordinate of the station.'),
    createdAt: z.date().describe('The date and time when the station was created.'),
    updatedAt: z.date().describe('The date and time when the station was last updated.'),
  })
  .describe('Schema representing a charging station.')

export const createStationSchema = stationSchema
  .pick({
    name: true,
    latitude: true,
    longitude: true,
  })
  .strict()
  .describe('Schema for creating a new charging station.')

export const updateStationSchema = stationSchema
  .pick({
    name: true,
    latitude: true,
    longitude: true,
  })
  .partial()
  .strict()
  .describe('Schema for updating an existing charging station.')

export const nearbyStationsQuerySchema = stationSchema
  .pick({
    latitude: true,
    longitude: true,
  })
  .extend({
    radius: z.number().positive().max(1000).default(10).describe('Search radius in kilometers (maximum 1000).'),
    limit: z.number().int().positive().max(100).default(20).describe('Maximum number of stations to return (maximum 100).'),
  })
  .describe('Schema for querying nearby charging stations.')

// Station response schemas
export const stationResponseSchema = stationSchema
  .pick({
    id: true,
    name: true,
    latitude: true,
    longitude: true,
    createdAt: true,
    updatedAt: true,
  })
  .describe('Schema representing a station response.')

export const stationSuccessResponseSchema = standardResponseSchema
  .pick({
    success: true,
    message: true,
  })
  .extend({
    data: stationResponseSchema,
  })
  .describe('Schema for successful station operation response.')

export const stationListResponseSchema = standardResponseSchema
  .pick({
    success: true,
  })
  .extend({
    data: z.array(stationResponseSchema),
    pagination: z.object({
      page: z.number().describe('Current page number.'),
      limit: z.number().describe('Number of items per page.'),
      total: z.number().describe('Total number of items.'),
      totalPages: z.number().describe('Total number of pages.'),
    }),
  })
  .describe('Schema for station list response.')

const stationWithDistanceResponseSchema = stationResponseSchema
  .extend({
    distance: z.number().describe('Distance from the query point in kilometers.'),
  })
  .describe('Schema representing a station with distance information.')

export const nearbyStationsResponseSchema = standardResponseSchema
  .pick({
    success: true,
    message: true,
  })
  .extend({
    data: z.array(stationWithDistanceResponseSchema),
  })
  .describe('Schema for nearby stations response.')

// Export types
export type Station = z.infer<typeof stationSchema>
export type CreateStation = z.infer<typeof createStationSchema>
export type UpdateStation = z.infer<typeof updateStationSchema>
export type NearbyStationsQuery = z.infer<typeof nearbyStationsQuerySchema>
export type StationResponse = z.infer<typeof stationResponseSchema>
export type StationWithDistanceResponse = z.infer<typeof stationWithDistanceResponseSchema>
export type StationSuccessResponse = z.infer<typeof stationSuccessResponseSchema>
export type StationListResponse = z.infer<typeof stationListResponseSchema>
export type NearbyStationsResponse = z.infer<typeof nearbyStationsResponseSchema>
