import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import { jsonSchemaTransform, jsonSchemaTransformObject, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { authRoutes } from './routes/auth'
import { stationRoutes } from './routes/stations'
import { userRoutes } from './routes/users'
import { createServices } from './services'

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
  const signAccess = (payload: any) => app.jwt.sign(payload, { expiresIn: '1h' })
  const signRefresh = (payload: any) => app.jwt.sign(payload, { expiresIn: '7d' })
  const verifyRefresh = (token: string) => app.jwt.verify(token)

  // Initialize services
  const services = createServices(signAccess, signRefresh, verifyRefresh)

  // Attach services to app instance for route access
  ;(app as any).authService = services.authService
  ;(app as any).stationService = services.stationService
  ;(app as any).userService = services.userService
  ;(app as any).prisma = services.prisma

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
    logLevel: 'silent',
  })

  // Register routes
  await app.register(authRoutes, { prefix: '/api/auth' })
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
