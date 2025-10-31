import type { PrismaClient } from '@prisma/client'
import { LoginSchema, RegisterSchema, type LoginBody, type RegisterBody } from '@voltfinder/validations'
import bcrypt from 'bcryptjs'
import type { SignAccessToken, SignRefreshToken, VerifyRefreshToken } from '../types'

// Tipagem leve para detectar erros conhecidos do Prisma sem importar runtime pesado
interface PrismaError extends Error {
  code?: string
}

export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private signAccess: SignAccessToken,
    private signRefresh: SignRefreshToken,
    private verifyRefresh: VerifyRefreshToken
  ) {}

  async register(data: RegisterBody) {
    const parsed = RegisterSchema.parse(data)
    const existing = await this.prisma.user.findUnique({ where: { email: parsed.email } })
    if (existing) {
      throw new Error('EMAIL_IN_USE')
    }
    const passwordHash = await bcrypt.hash(parsed.password, 10)
    let user
    try {
      user = await this.prisma.user.create({
        data: {
          email: parsed.email,
          name: parsed.name,
          password: passwordHash,
        },
      })
    } catch (e) {
      const err = e as PrismaError
      // Unique constraint (email) - fallback se corrida de condição entre findUnique e create
      if (err.code === 'P2002') {
        throw new Error('EMAIL_IN_USE')
      }
      throw err
    }

    const token = this.signAccess({ userId: user.id })
    const refreshToken = this.signRefresh({ userId: user.id })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
      refreshToken,
    }
  }

  async login(data: LoginBody) {
    const parsed = LoginSchema.parse(data)
    const user = await this.prisma.user.findUnique({ where: { email: parsed.email } })
    if (!user) {
      throw new Error('INVALID_CREDENTIALS')
    }
    const valid = await bcrypt.compare(parsed.password, user.password)
    if (!valid) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const token = this.signAccess({ userId: user.id })
    const refreshToken = this.signRefresh({ userId: user.id })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
      refreshToken,
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.verifyRefresh(refreshToken)
      if (!payload || typeof payload.userId !== 'number') {
        throw new Error('INVALID_REFRESH')
      }
      const user = await this.prisma.user.findUnique({ where: { id: payload.userId } })
      if (!user) throw new Error('INVALID_REFRESH')

      const token = this.signAccess({ userId: user.id })
      const newRefresh = this.signRefresh({ userId: user.id })

      return { token, refreshToken: newRefresh }
    } catch {
      throw new Error('INVALID_REFRESH')
    }
  }

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}

export function createAuthService(
  prisma: PrismaClient,
  signAccess: SignAccessToken,
  signRefresh: SignRefreshToken,
  verifyRefresh: VerifyRefreshToken
) {
  return new AuthService(prisma, signAccess, signRefresh, verifyRefresh)
}
