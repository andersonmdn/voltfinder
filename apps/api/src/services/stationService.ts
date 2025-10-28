import type { PrismaClient } from '@prisma/client'
import { createStationSchema, updateStationSchema, type CreateStation, type NearbyStationsQuery, type UpdateStation } from '@voltfinder/validations'

// Tipagem leve para detectar erros conhecidos do Prisma sem importar runtime pesado
interface PrismaError extends Error {
  code?: string
}

export class StationService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateStation) {
    const parsed = createStationSchema.parse(data)

    try {
      const station = await this.prisma.station.create({
        data: {
          name: parsed.name,
          latitude: parsed.latitude,
          longitude: parsed.longitude,
        },
      })

      return station
    } catch (e) {
      const err = e as PrismaError
      throw err
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [stations, total] = await Promise.all([
      this.prisma.station.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.station.count(),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      stations,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async findById(id: number) {
    const station = await this.prisma.station.findUnique({
      where: { id },
    })

    if (!station) {
      throw new Error('STATION_NOT_FOUND')
    }

    return station
  }

  async update(id: number, data: UpdateStation) {
    const parsed = updateStationSchema.parse(data)

    try {
      const station = await this.prisma.station.update({
        where: { id },
        data: parsed,
      })

      return station
    } catch (e) {
      const err = e as PrismaError
      if (err.code === 'P2025') {
        throw new Error('STATION_NOT_FOUND')
      }
      throw err
    }
  }

  async delete(id: number) {
    try {
      await this.prisma.station.delete({
        where: { id },
      })

      return { success: true }
    } catch (e) {
      const err = e as PrismaError
      if (err.code === 'P2025') {
        throw new Error('STATION_NOT_FOUND')
      }
      throw err
    }
  }

  /**
   * Busca estações próximas usando a fórmula de Haversine
   * @param query Parâmetros de busca (latitude, longitude, radius em km, limit)
   * @returns Lista de estações com distância calculada
   */
  async findNearby(query: NearbyStationsQuery) {
    const { latitude, longitude, radius, limit } = query

    // Query SQL bruta usando a fórmula de Haversine para calcular distância
    const stations = await this.prisma.$queryRaw<
      Array<{
        id: number
        name: string
        latitude: number
        longitude: number
        createdAt: Date
        updatedAt: Date
        distance: number
      }>
    >`
      SELECT 
        id,
        name,
        latitude,
        longitude,
        "createdAt",
        "updatedAt",
        (
          6371 * acos(
            cos(radians(${latitude})) * 
            cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${longitude})) + 
            sin(radians(${latitude})) * 
            sin(radians(latitude))
          )
        ) AS distance
      FROM stations
      WHERE (
        6371 * acos(
          cos(radians(${latitude})) * 
          cos(radians(latitude)) * 
          cos(radians(longitude) - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(latitude))
        )
      ) <= ${radius}
      ORDER BY distance ASC
      LIMIT ${limit}
    `

    return stations.map((station) => ({
      ...station,
      distance: Math.round(station.distance * 100) / 100, // Arredondar para 2 casas decimais
    }))
  }

  /**
   * Versão alternativa usando filtro simples por coordenadas (menos precisa mas mais rápida)
   * Útil quando performance é mais importante que precisão
   */
  async findNearbySimple(query: NearbyStationsQuery) {
    const { latitude, longitude, radius, limit } = query

    // Conversão aproximada: 1 grau ≈ 111 km
    const latitudeDelta = radius / 111
    const longitudeDelta = radius / (111 * Math.cos((latitude * Math.PI) / 180))

    const stations = await this.prisma.station.findMany({
      where: {
        latitude: {
          gte: latitude - latitudeDelta,
          lte: latitude + latitudeDelta,
        },
        longitude: {
          gte: longitude - longitudeDelta,
          lte: longitude + longitudeDelta,
        },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    // Calcular distância real para os resultados filtrados
    return stations
      .map((station) => {
        const distance = this.calculateDistance(latitude, longitude, station.latitude, station.longitude)
        return {
          ...station,
          distance: Math.round(distance * 100) / 100,
        }
      })
      .filter((station) => station.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
  }

  /**
   * Calcula a distância entre duas coordenadas usando a fórmula de Haversine
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Raio da Terra em km
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }
}

export function createStationService(prisma: PrismaClient) {
  return new StationService(prisma)
}
