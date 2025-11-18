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
  stationSuccessResponseSchemaWithChargePoints,
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
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify()
        } catch (err) {
          reply.code(HTTP_STATUS.UNAUTHORIZED).send({
            success: false,
            error: 'Unauthorized',
            message: 'Valid authentication token required',
          })
        }
      },
      schema: {
        tags: ['Stations'],
        summary: 'Create a new station',
        description: 'Create a new charging station with name and coordinates',
        security: [{ Bearer: [] }],
        body: createStationSchema,
        response: {
          201: stationSuccessResponseSchema,
          400: standardErrorSchema,
          401: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const station = await app.stationService.create(request.body)

        reply.code(HTTP_STATUS.CREATED).send({
          success: true,
          data: station,
          message: 'Station created successfully',
        })
      } catch (error) {
        app.log.error({ error }, 'Error creating station')

        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while creating the station',
        })
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
        const { page, limit } = request.query
        const result = await app.stationService.findAll(page, limit)

        return {
          success: true,
          data: result.stations,
          pagination: result.pagination,
        }
      } catch (error) {
        app.log.error({ error }, 'Error fetching stations')

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
          200: stationSuccessResponseSchemaWithChargePoints,
          404: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const station = await app.stationService.findById(id)

        return {
          success: true,
          data: station,
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'STATION_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'Station not found',
            message: 'The requested station does not exist',
          }
        }

        app.log.error({ error }, 'Error fetching station')
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
        const { id } = request.params
        const station = await app.stationService.update(id, request.body)

        return {
          success: true,
          data: station,
          message: 'Station updated successfully',
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'STATION_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'Station not found',
            message: 'The requested station does not exist',
          }
        }

        app.log.error({ error }, 'Error updating station')
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
        const { id } = request.params
        await app.stationService.delete(id)

        return {
          success: true,
          message: 'Station deleted successfully',
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'STATION_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'Station not found',
            message: 'The requested station does not exist',
          }
        }

        app.log.error({ error }, 'Error deleting station')
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
        const query = request.query
        const stations = await app.stationService.findNearby(query)

        return {
          success: true,
          data: stations,
          message: `Found ${stations.length} stations within ${query.radius}km`,
        }
      } catch (error) {
        app.log.error({ error }, 'Error finding nearby stations')

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
