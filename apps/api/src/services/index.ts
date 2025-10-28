import { PrismaClient } from '@prisma/client'
import { createAuthService } from './authService'
import { createStationService } from './stationService'
import { createUserService } from './userService'

const prisma = new PrismaClient()

// JWT helper functions (these would be injected from your JWT service)
export function createServices(signAccess: (payload: any) => string, signRefresh: (payload: any) => string, verifyRefresh: (token: string) => any) {
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
