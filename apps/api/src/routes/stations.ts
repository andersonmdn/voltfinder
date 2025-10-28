import { HTTP_STATUS } from '@voltfinder/core'
import {
  createStationSchema,
  deleteSuccessSchema,
  idParamSchema,
  nearbyStationsQuerySchema,
  nearbyStationsResponseSchema,
  paginationSchema,
  standardErrorSchema,
  stationListResponseSchema,
  stationSuccessResponseSchema,
  updateStationSchema,
} from '@voltfinder/validations'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function stationRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>()

  // Create Station
  server.post(
    '/',
    {
      schema: {
        tags: ['Stations'],
        summary: 'Create a new station',
        description: 'Create a new charging station with name and coordinates',
        body: createStationSchema,
        response: {
          201: stationSuccessResponseSchema,
          400: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const stationService = (app as any).stationService
        const station = await stationService.create(request.body)

        reply.code(HTTP_STATUS.CREATED)
        return {
          success: true,
          data: {
            ...station,
            createdAt: station.createdAt.toISOString(),
            updatedAt: station.updatedAt.toISOString(),
          },
          message: 'Station created successfully',
        }
      } catch (error: any) {
        app.log.error('Error creating station:', error)

        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while creating the station',
        }
      }
    }
  )

  // Get All Stations
  server.get(
    '/',
    {
      schema: {
        tags: ['Stations'],
        summary: 'Get all stations',
        description: 'Retrieve all charging stations with pagination',
        querystring: paginationSchema,
        response: {
          200: stationListResponseSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const stationService = (app as any).stationService
        const { page, limit } = request.query as any
        const result = await stationService.findAll(page, limit)

        return {
          success: true,
          data: result.stations.map((station: any) => ({
            ...station,
            createdAt: station.createdAt.toISOString(),
            updatedAt: station.updatedAt.toISOString(),
          })),
          pagination: result.pagination,
        }
      } catch (error: any) {
        app.log.error('Error fetching stations:', error)

        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while fetching stations',
        }
      }
    }
  )

  // Get Station by ID
  server.get(
    '/:id',
    {
      schema: {
        tags: ['Stations'],
        summary: 'Get station by ID',
        description: 'Retrieve a specific charging station by its ID',
        params: idParamSchema,
        response: {
          200: stationSuccessResponseSchema,
          404: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const stationService = (app as any).stationService
        const { id } = request.params as any
        const station = await stationService.findById(id)

        return {
          success: true,
          data: {
            ...station,
            createdAt: station.createdAt.toISOString(),
            updatedAt: station.updatedAt.toISOString(),
          },
        }
      } catch (error: any) {
        if (error.message === 'STATION_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'Station not found',
            message: 'The requested station does not exist',
          }
        }

        app.log.error('Error fetching station:', error)
        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while fetching the station',
        }
      }
    }
  )

  // Update Station
  server.patch(
    '/:id',
    {
      schema: {
        tags: ['Stations'],
        summary: 'Update station',
        description: 'Update a charging station by its ID',
        params: idParamSchema,
        body: updateStationSchema,
        response: {
          200: stationSuccessResponseSchema,
          404: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const stationService = (app as any).stationService
        const { id } = request.params as any
        const station = await stationService.update(id, request.body)

        return {
          success: true,
          data: {
            ...station,
            createdAt: station.createdAt.toISOString(),
            updatedAt: station.updatedAt.toISOString(),
          },
          message: 'Station updated successfully',
        }
      } catch (error: any) {
        if (error.message === 'STATION_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'Station not found',
            message: 'The requested station does not exist',
          }
        }

        app.log.error('Error updating station:', error)
        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while updating the station',
        }
      }
    }
  )

  // Delete Station
  server.delete(
    '/:id',
    {
      schema: {
        tags: ['Stations'],
        summary: 'Delete station',
        description: 'Delete a charging station by its ID',
        params: idParamSchema,
        response: {
          200: deleteSuccessSchema,
          404: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const stationService = (app as any).stationService
        const { id } = request.params as any
        await stationService.delete(id)

        return {
          success: true,
          message: 'Station deleted successfully',
        }
      } catch (error: any) {
        if (error.message === 'STATION_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'Station not found',
            message: 'The requested station does not exist',
          }
        }

        app.log.error('Error deleting station:', error)
        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while deleting the station',
        }
      }
    }
  )

  // Get Nearby Stations
  server.get(
    '/nearby/search',
    {
      schema: {
        tags: ['Stations'],
        summary: 'Find nearby stations',
        description: 'Find charging stations near a specific coordinate within a given radius',
        querystring: nearbyStationsQuerySchema,
        response: {
          200: nearbyStationsResponseSchema,
          400: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const stationService = (app as any).stationService
        const query = request.query as any
        const stations = await stationService.findNearby(query)

        return {
          success: true,
          data: stations.map((station: any) => ({
            ...station,
            createdAt: station.createdAt.toISOString(),
            updatedAt: station.updatedAt.toISOString(),
          })),
          message: `Found ${stations.length} stations within ${query.radius}km`,
        }
      } catch (error: any) {
        app.log.error('Error finding nearby stations:', error)

        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while searching for nearby stations',
        }
      }
    }
  )
}
