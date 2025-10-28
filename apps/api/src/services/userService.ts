import type { PrismaClient } from '@prisma/client'

export class UserService {
  constructor(private prisma: PrismaClient) {}

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }

    return user
  }

  async getUsersList(page: number, limit: number) {
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count(),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }
}

export function createUserService(prisma: PrismaClient) {
  return new UserService(prisma)
}
