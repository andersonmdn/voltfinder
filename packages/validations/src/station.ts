import { z } from 'zod/v4'
import { standardResponseSchema } from './common'

// Station schemas
export const stationSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createStationSchema = stationSchema
  .pick({
    name: true,
    latitude: true,
    longitude: true,
  })
  .strict()

export const updateStationSchema = stationSchema
  .pick({
    name: true,
    latitude: true,
    longitude: true,
  })
  .partial()
  .strict()

export const nearbyStationsQuerySchema = stationSchema
  .pick({
    latitude: true,
    longitude: true,
  })
  .extend({
    radius: z.number().positive().max(1000).default(10),
    limit: z.number().int().positive().max(100).default(20),
  })

// Station response schemas
export const stationResponseSchema = stationSchema.pick({
  id: true,
  name: true,
  latitude: true,
  longitude: true,
  createdAt: true,
  updatedAt: true,
})

export const stationSuccessResponseSchema = standardResponseSchema
  .pick({
    success: true,
    message: true,
  })
  .extend({
    data: stationResponseSchema,
  })

export const stationListResponseSchema = standardResponseSchema
  .pick({
    success: true,
  })
  .extend({
    data: z.array(stationResponseSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  })

const stationWithDistanceResponseSchema = stationResponseSchema.extend({
  distance: z.number(),
})

export const nearbyStationsResponseSchema = standardResponseSchema
  .pick({
    success: true,
    message: true,
  })
  .extend({
    data: z.array(stationWithDistanceResponseSchema),
  })

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
