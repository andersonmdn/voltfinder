import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import { jsonSchemaTransform, jsonSchemaTransformObject, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import fs from 'fs'
import path from 'path'
import { authRoutes } from './routes/auth'
import { chargePointRoutes } from './routes/chargePoints'
import { stationRoutes } from './routes/stations'
import { userRoutes } from './routes/users'
import { createServices } from './services'
import type { JWTAccessPayload, JWTRefreshPayload, JWTVerifiedPayload } from './types'

export const buildApp = async () => {
  const app = fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transport:
        process.env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                ignore: 'pid,hostname',
                singleLine: true,
              },
            }
          : undefined,
    },
  }).withTypeProvider<ZodTypeProvider>()

  // Set up Zod validation
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  // Register plugins
  await app.register(cors, {
    origin: true,
    credentials: true,
  })

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  })

  // Create JWT helper functions
  const signAccess = (payload: JWTAccessPayload): string => app.jwt.sign(payload, { expiresIn: '1h' })
  const signRefresh = (payload: JWTRefreshPayload): string => app.jwt.sign(payload, { expiresIn: '7d' })
  const verifyRefresh = (token: string): JWTVerifiedPayload => {
    const verified = app.jwt.verify(token)
    return verified as JWTVerifiedPayload
  }

  // Initialize services
  const services = createServices(signAccess, signRefresh, verifyRefresh)

  // Decorate app with services using Fastify decorators
  app.decorate('authService', services.authService)
  app.decorate('chargePointService', services.chargePointService)
  app.decorate('stationService', services.stationService)
  app.decorate('userService', services.userService)
  app.decorate('prisma', services.prisma)

  // Register swagger first without any configuration issues
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'VoltFinder API',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          Bearer: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
    transformObject: jsonSchemaTransformObject,
  })

  await app.register(swaggerUI, {
    routePrefix: '/docs',
    logLevel: 'debug',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    theme: {
      title: 'VoltFinder API Docs',
      favicon: [
        {
          type: 'image/png',
          filename: path.join(__dirname, '../assets/swagger-logo.png'),
          content: fs.readFileSync(path.join(__dirname, '../assets/swagger-logo.png')),
          rel: 'icon',
          sizes: '32x32',
        },
      ],
    },
    logo: {
      type: 'image/png',
      content: fs.readFileSync(path.join(__dirname, '../assets/swagger-logo.png')),
      href: '/docs',
      target: '_blank',
    },
  })

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error)

    if (error.code === 'FST_ERR_VALIDATION') {
      return reply.status(400).send({
        success: false,
        error: 'Validation Error',
        message: error.message,
      })
    }

    if (error.code === 'FST_ERR_CTP_INVALID_JSON_BODY') {
      return reply.status(400).send({
        success: false,
        error: 'Invalid JSON body',
        message: error.message,
      })
    }

    if (error.code === 'FST_ERR_RESPONSE_SERIALIZATION') {
      app.log.error('Response serialization error')
      return reply.status(500).send({
        success: false,
        error: 'Response Serialization Error',
        message: 'Failed to serialize response',
      })
    }

    if (error instanceof Error) {
      app.log.error('====== NEW ERROR DETAILS ======')
      app.log.error(`Error name: ${error.name}`)
      app.log.error(`Error message: ${error.message}`)
      app.log.error(`Error stack: ${error.stack}`)
      app.log.error(`Error code: ${error.code}`)
      app.log.error('====== END ERROR DETAILS ======')
    }

    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    })
  })

  // Register routes
  await app.register(authRoutes, { prefix: '/api/auth' })
  await app.register(chargePointRoutes, { prefix: '/api/charge-points' })
  await app.register(stationRoutes, { prefix: '/api/stations' })
  await app.register(userRoutes, { prefix: '/api/users' })

  // Health check
  app.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Check if the API is running',
      },
    },
    async () => {
      return { status: 'ok', timestamp: new Date().toISOString() }
    }
  )

  return app
}

export type App = Awaited<ReturnType<typeof buildApp>>
