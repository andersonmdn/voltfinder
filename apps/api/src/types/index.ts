import type { PrismaClient } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { AuthService } from '../services/authService'
import type { StationService } from '../services/stationService'
import type { UserService } from '../services/userService'

// JWT Payload interfaces
export interface JWTAccessPayload {
  userId: number
}

export interface JWTRefreshPayload {
  userId: number
}

export interface JWTVerifiedPayload {
  userId: number
  iat?: number
  exp?: number
}

// JWT Functions types
export type SignAccessToken = (payload: JWTAccessPayload) => string
export type SignRefreshToken = (payload: JWTRefreshPayload) => string
export type VerifyRefreshToken = (token: string) => JWTVerifiedPayload

// Services container
export interface Services {
  authService: AuthService
  stationService: StationService
  userService: UserService
  prisma: PrismaClient
}

// Extended FastifyRequest for authenticated routes
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JWTVerifiedPayload
    user: JWTVerifiedPayload
  }
}

// Decorators for Fastify instance
declare module 'fastify' {
  interface FastifyInstance {
    authService: AuthService
    stationService: StationService
    userService: UserService
    prisma: PrismaClient
  }
}
