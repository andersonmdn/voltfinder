import type { PrismaClient } from '@prisma/client'
import { createChargePointSchema, updateChargePointSchema, type CreateChargePoint, type UpdateChargePoint } from '@voltfinder/validations'

// Tipagem leve para detectar erros conhecidos do Prisma sem importar runtime pesado
interface PrismaError extends Error {
  code?: string
}

export class ChargePointService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateChargePoint) {
    const parsed = createChargePointSchema.parse(data)

    try {
      // Verificar se a estação existe
      const station = await this.prisma.station.findUnique({
        where: { id: parsed.stationId },
      })

      if (!station) {
        throw new Error('STATION_NOT_FOUND')
      }

      const chargePoint = await this.prisma.chargePoint.create({
        data: parsed,
        include: {
          station: true,
        },
      })

      return chargePoint
    } catch (e) {
      const err = e as PrismaError
      throw err
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [chargePoints, total] = await Promise.all([
      this.prisma.chargePoint.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          station: true,
        },
      }),
      this.prisma.chargePoint.count(),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      chargePoints,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async findById(id: number) {
    const chargePoint = await this.prisma.chargePoint.findUnique({
      where: { id },
      include: {
        station: true,
      },
    })

    if (!chargePoint) {
      throw new Error('CHARGE_POINT_NOT_FOUND')
    }

    return chargePoint
  }

  async findByStationId(stationId: number) {
    // Verificar se a estação existe
    const station = await this.prisma.station.findUnique({
      where: { id: stationId },
    })

    if (!station) {
      throw new Error('STATION_NOT_FOUND')
    }

    const chargePoints = await this.prisma.chargePoint.findMany({
      where: { stationId },
      orderBy: { createdAt: 'desc' },
      include: {
        station: true,
      },
    })

    return chargePoints
  }

  async update(id: number, data: UpdateChargePoint) {
    const parsed = updateChargePointSchema.parse(data)

    try {
      // Se stationId está sendo atualizado, verificar se a nova estação existe
      if (parsed.stationId) {
        const station = await this.prisma.station.findUnique({
          where: { id: parsed.stationId },
        })

        if (!station) {
          throw new Error('STATION_NOT_FOUND')
        }
      }

      const chargePoint = await this.prisma.chargePoint.update({
        where: { id },
        data: parsed,
        include: {
          station: true,
        },
      })

      return chargePoint
    } catch (e) {
      const err = e as PrismaError
      if (err.code === 'P2025') {
        throw new Error('CHARGE_POINT_NOT_FOUND')
      }
      throw err
    }
  }

  async delete(id: number) {
    try {
      await this.prisma.chargePoint.delete({
        where: { id },
      })

      return { success: true }
    } catch (e) {
      const err = e as PrismaError
      if (err.code === 'P2025') {
        throw new Error('CHARGE_POINT_NOT_FOUND')
      }
      throw err
    }
  }

  async updateStatus(id: number, status: 'BUSY' | 'FREE' | 'CLOSED' | 'MAINTENANCE') {
    try {
      const chargePoint = await this.prisma.chargePoint.update({
        where: { id },
        data: { status },
        include: {
          station: true,
        },
      })

      return chargePoint
    } catch (e) {
      const err = e as PrismaError
      if (err.code === 'P2025') {
        throw new Error('CHARGE_POINT_NOT_FOUND')
      }
      throw err
    }
  }
}

export function createChargePointService(prisma: PrismaClient) {
  return new ChargePointService(prisma)
}
