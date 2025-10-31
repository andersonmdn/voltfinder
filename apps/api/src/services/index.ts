import { PrismaClient } from '@prisma/client'
import type { Services, SignAccessToken, SignRefreshToken, VerifyRefreshToken } from '../types'
import { createAuthService } from './authService'
import { createStationService } from './stationService'
import { createUserService } from './userService'

const prisma = new PrismaClient()

export function createServices(signAccess: SignAccessToken, signRefresh: SignRefreshToken, verifyRefresh: VerifyRefreshToken): Services {
  const authService = createAuthService(prisma, signAccess, signRefresh, verifyRefresh)
  const stationService = createStationService(prisma)
  const userService = createUserService(prisma)

  return {
    authService,
    stationService,
    userService,
    prisma,
  }
}

export { AuthService } from './authService'
export { StationService } from './stationService'
export { UserService } from './userService'
