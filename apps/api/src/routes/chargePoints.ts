import { HTTP_STATUS } from '@voltfinder/core'
import {
  chargePointListResponseSchema,
  chargePointSuccessResponseSchema,
  createChargePointSchema,
  deleteSuccessSchema,
  idParamSchema,
  paginationSchema,
  standardErrorSchema,
  updateChargePointSchema,
  updateChargePointStatusSchema,
} from '@voltfinder/validations'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function chargePointRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>()

  // Create Charge Point
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
        tags: ['Charge Points'],
        summary: 'Create a new charge point',
        description: 'Create a new charge point for a charging station',
        security: [{ Bearer: [] }],
        body: createChargePointSchema,
        response: {
          201: chargePointSuccessResponseSchema,
          400: standardErrorSchema,
          401: standardErrorSchema,
          404: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const chargePoint = await app.chargePointService.create(request.body)

        reply.code(HTTP_STATUS.CREATED).send({
          success: true,
          data: chargePoint,
          message: 'Charge point created successfully',
        })
      } catch (error) {
        if (error instanceof Error && error.message === 'STATION_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'Station not found',
            message: 'The specified station does not exist',
          }
        }

        app.log.error({ error }, 'Error creating charge point')

        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while creating the charge point',
        })
      }
    }
  )

  // Get All Charge Points
  server.get(
    '/',
    {
      schema: {
        tags: ['Charge Points'],
        summary: 'Get all charge points',
        description: 'Retrieve all charge points with pagination',
        querystring: paginationSchema,
        response: {
          200: chargePointListResponseSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { page, limit } = request.query
        const result = await app.chargePointService.findAll(page, limit)

        return {
          success: true,
          data: result.chargePoints,
          pagination: result.pagination,
        }
      } catch (error) {
        app.log.error({ error }, 'Error fetching charge points')

        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while fetching charge points',
        }
      }
    }
  )

  // Get Charge Point by ID
  server.get(
    '/:id',
    {
      schema: {
        tags: ['Charge Points'],
        summary: 'Get charge point by ID',
        description: 'Retrieve a specific charge point by its ID',
        params: idParamSchema,
        response: {
          200: chargePointSuccessResponseSchema,
          404: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const chargePoint = await app.chargePointService.findById(id)

        return {
          success: true,
          data: chargePoint,
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'CHARGE_POINT_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'Charge point not found',
            message: 'The requested charge point does not exist',
          }
        }

        app.log.error({ error }, 'Error fetching charge point')
        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while fetching the charge point',
        }
      }
    }
  )

  // Update Charge Point
  server.patch(
    '/:id',
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
        tags: ['Charge Points'],
        summary: 'Update charge point',
        description: 'Update a charge point by its ID',
        security: [{ Bearer: [] }],
        params: idParamSchema,
        body: updateChargePointSchema,
        response: {
          200: chargePointSuccessResponseSchema,
          401: standardErrorSchema,
          404: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const chargePoint = await app.chargePointService.update(id, request.body)

        return {
          success: true,
          data: chargePoint,
          message: 'Charge point updated successfully',
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'CHARGE_POINT_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'Charge point not found',
            message: 'The requested charge point does not exist',
          }
        }

        if (error instanceof Error && error.message === 'STATION_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'Station not found',
            message: 'The specified station does not exist',
          }
        }

        app.log.error({ error }, 'Error updating charge point')
        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while updating the charge point',
        }
      }
    }
  )

  // Update Charge Point Status
  server.patch(
    '/:id/status',
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
        tags: ['Charge Points'],
        summary: 'Update charge point status',
        description: 'Update the status of a charge point',
        security: [{ Bearer: [] }],
        params: idParamSchema,
        body: updateChargePointStatusSchema,
        response: {
          200: chargePointSuccessResponseSchema,
          401: standardErrorSchema,
          404: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const { status } = request.body
        const chargePoint = await app.chargePointService.updateStatus(id, status)

        return {
          success: true,
          data: chargePoint,
          message: 'Charge point status updated successfully',
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'CHARGE_POINT_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'Charge point not found',
            message: 'The requested charge point does not exist',
          }
        }

        app.log.error({ error }, 'Error updating charge point status')
        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while updating the charge point status',
        }
      }
    }
  )

  // Delete Charge Point
  server.delete(
    '/:id',
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
        tags: ['Charge Points'],
        summary: 'Delete charge point',
        description: 'Delete a charge point by its ID',
        security: [{ Bearer: [] }],
        params: idParamSchema,
        response: {
          200: deleteSuccessSchema,
          401: standardErrorSchema,
          404: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        await app.chargePointService.delete(id)

        return {
          success: true,
          message: 'Charge point deleted successfully',
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'CHARGE_POINT_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'Charge point not found',
            message: 'The requested charge point does not exist',
          }
        }

        app.log.error({ error }, 'Error deleting charge point')
        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while deleting the charge point',
        }
      }
    }
  )

  // Get Charge Points by Station ID
  server.get(
    '/station/:id',
    {
      schema: {
        tags: ['Charge Points'],
        summary: 'Get charge points by station ID',
        description: 'Retrieve all charge points for a specific station',
        params: idParamSchema,
        response: {
          200: chargePointListResponseSchema,
          404: standardErrorSchema,
          500: standardErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const chargePoints = await app.chargePointService.findByStationId(id)

        return {
          success: true,
          data: chargePoints,
          pagination: {
            page: 1,
            limit: chargePoints.length,
            total: chargePoints.length,
            totalPages: 1,
          },
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'STATION_NOT_FOUND') {
          reply.code(HTTP_STATUS.NOT_FOUND)
          return {
            success: false,
            error: 'Station not found',
            message: 'The specified station does not exist',
          }
        }

        app.log.error({ error }, 'Error fetching charge points by station')
        reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        return {
          success: false,
          error: 'Internal server error',
          message: 'Something went wrong while fetching charge points for the station',
        }
      }
    }
  )
}
