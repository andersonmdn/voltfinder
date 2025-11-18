import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { apiClient } from './helpers/apiClient'

describe('Station Routes', () => {
  let authToken: string
  const testStationIds: string[] = []
  const testChargePointsIds: string[] = []

  beforeAll(async () => {
    console.log('🏗️ Setting up Station tests...')

    // Create a user and get auth token for protected routes
    const userData = {
      email: `station-test-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Station Test User',
    }

    await apiClient.post('/api/auth/register', userData)
    const loginResponse = await apiClient.post('/api/auth/login', {
      email: userData.email,
      password: userData.password,
    })
    const { data } = JSON.parse(loginResponse.body)
    const { token } = data

    authToken = token
  })

  afterAll(async () => {
    console.log('🧹 Cleaning up Station test data...')
    // Delete test charge points created during tests
    for (const chargePointId of testChargePointsIds) {
      const response = await apiClient.delete(`/api/charge-points/${chargePointId}`, {
        authorization: `Bearer ${authToken}`,
      })

      expect([200, 204, 404]).toContain(response.statusCode)
    }

    // Delete test stations created during tests
    for (const stationId of testStationIds) {
      const response = await apiClient.delete(`/api/stations/${stationId}`, {
        authorization: `Bearer ${authToken}`,
      })

      expect([200, 204, 404]).toContain(response.statusCode)
    }
  })

  describe('POST /api/stations', () => {
    it('Should create a new station with and charge points', async () => {
      const stationData = {
        name: `Test Station ${Date.now()}`,
        latitude: 40.7128,
        longitude: -74.006,
        address: 'R. Teste, 123 - Teste, Teste - TS, 12345-678',
        workingHours: 'Segunda a Sexta, 8h às 18h',
      }

      const chargePointsData = [
        {
          type: 'TYPE2',
          powerKW: 22,
          pricePerKwh: 0.3,
          status: 'FREE',
        },
        {
          type: 'CCS',
          powerKW: 50,
          pricePerKwh: 0.4,
          status: 'BUSY',
        },
        {
          type: 'CHAdeMO',
          powerKW: 50,
          pricePerKwh: 0.45,
          status: 'CLOSED',
        },
        {
          type: 'TYPE1',
          powerKW: 11,
          pricePerKwh: 0.25,
          status: 'MAINTENANCE',
        },
      ]

      const stationResponse = await apiClient.post('/api/stations', stationData, {
        authorization: `Bearer ${authToken}`,
      })

      expect(stationResponse.statusCode).toBe(201)

      const stationBody = JSON.parse(stationResponse.body)
      expect(stationBody.success).toBeTruthy()
      expect(stationBody.data.name).toBe(stationData.name)
      expect(stationBody.data.latitude).toBe(stationData.latitude)
      expect(stationBody.data.longitude).toBe(stationData.longitude)
      expect(stationBody.data.address).toBe(stationData.address)
      expect(stationBody.data.workingHours).toBe(stationData.workingHours)
      expect(stationBody.data).toHaveProperty('createdAt')
      expect(stationBody.data).toHaveProperty('updatedAt')

      for (const chargePointData of chargePointsData) {
        const chargePointsResponse = await apiClient.post(
          '/api/charge-points',
          { ...chargePointData, stationId: stationBody.data.id },
          { authorization: `Bearer ${authToken}` }
        )

        expect(chargePointsResponse.statusCode).toBe(201)

        const chargePointBody = JSON.parse(chargePointsResponse.body)
        expect(chargePointBody.success).toBeTruthy()
        expect(chargePointBody.data).toHaveProperty('id')
        expect(chargePointBody.data).toHaveProperty('stationId', stationBody.data.id)
        expect(chargePointBody.data).toHaveProperty('type', chargePointData.type)
        expect(chargePointBody.data).toHaveProperty('powerKW', chargePointData.powerKW)
        expect(chargePointBody.data).toHaveProperty('pricePerKwh', chargePointData.pricePerKwh)
        expect(chargePointBody.data).toHaveProperty('status', chargePointData.status)
        expect(chargePointBody.data).toHaveProperty('createdAt')
        expect(chargePointBody.data).toHaveProperty('updatedAt')
        expect(chargePointBody.data).toHaveProperty('station')
        expect(chargePointBody.data.station).toHaveProperty('id', stationBody.data.id)
        expect(chargePointBody.data.station).toHaveProperty('name', stationData.name)
        expect(chargePointBody.data.station).toHaveProperty('latitude', stationData.latitude)
        expect(chargePointBody.data.station).toHaveProperty('longitude', stationData.longitude)
        expect(chargePointBody.data.station).toHaveProperty('address', stationData.address)
        expect(chargePointBody.data.station).toHaveProperty('workingHours', stationData.workingHours)

        // Store for cleanup
        testChargePointsIds.push(chargePointBody.data.id)
      }

      // Store for cleanup
      if (stationBody.data.id) {
        testStationIds.push(stationBody.data.id)
      }
    })

    it('Should return 400 for invalid coordinates', async () => {
      const response = await apiClient.post(
        '/api/stations',
        {
          name: 'Invalid Station',
          latitude: 91,
          longitude: -74.006,
        },
        {
          authorization: `Bearer ${authToken}`,
        }
      )

      expect(response.statusCode).toBe(400)
      const body = JSON.parse(response.body)
      expect(body.success).toBeFalsy()
      expect(body).toHaveProperty('error')
      expect(body.error).toBe('Validation Error')
      expect(body).toHaveProperty('message')
      expect(body.message).toContain('body/latitude Too big: expected number to be <=90')
      expect(body.message).toContain('body/address Invalid input: expected string, received undefined')
      expect(body.message).toContain('body/workingHours Invalid input: expected string, received undefined')
    })

    it('Should return 400 for missing required fields', async () => {
      const response = await apiClient.post(
        '/api/stations',
        {
          name: 'Incomplete Station',
          // Missing required fields
        },
        {
          authorization: `Bearer ${authToken}`,
        }
      )

      expect(response.statusCode).toBe(400)
      const body = JSON.parse(response.body)
      expect(body.success).toBeFalsy()
      expect(body).toHaveProperty('error')
      expect(body.error).toBe('Validation Error')
      expect(body).toHaveProperty('message')
      expect(body.message).toContain('body/latitude Invalid input: expected number, received undefined')
      expect(body.message).toContain('body/longitude Invalid input: expected number, received undefined')
      expect(body.message).toContain('body/address Invalid input: expected string, received undefined')
      expect(body.message).toContain('body/workingHours Invalid input: expected string, received undefined')
    })

    it('Should return 401 for unauthenticated request', async () => {
      const response = await apiClient.post('/api/stations', {
        name: 'Test Station',
        latitude: 40.7128,
        longitude: -74.006,
        address: 'R. Teste, 123 - Teste, Teste - TS, 12345-678',
        workingHours: 'Segunda a Sexta, 8h às 18h',
      })

      expect(response.statusCode).toBe(401)
      const body = JSON.parse(response.body)
      expect(body.success).toBeFalsy()
      expect(body).toHaveProperty('error', 'Unauthorized')
      expect(body).toHaveProperty('message', 'Valid authentication token required')
    })
  })

  describe('GET /api/stations/:id', () => {
    let stationId: string
    let chargePointId: string

    beforeAll(async () => {
      // Create a station for testing
      const stationData = {
        name: `Test Station for Get ${Date.now()}`,
        latitude: 40.7128,
        longitude: -74.006,
        address: 'R. Get Teste, 456 - Gete, Gete - GT, 65432-109',
        workingHours: 'Segunda a Sexta, 9h às 17h',
      }

      const chargePointsData = {
        type: 'TYPE2',
        powerKW: 22,
        pricePerKwh: 0.3,
        status: 'FREE',
      }

      const stationResponse = await apiClient.post('/api/stations', stationData, {
        authorization: `Bearer ${authToken}`,
      })

      expect(stationResponse.statusCode).toBe(201)

      const stationBody = JSON.parse(stationResponse.body)
      stationId = stationBody.data.id
      testStationIds.push(stationId)

      const chargePointsResponse = await apiClient.post(
        '/api/charge-points',
        { ...chargePointsData, stationId },
        {
          authorization: `Bearer ${authToken}`,
        }
      )

      expect(chargePointsResponse.statusCode).toBe(201)

      const chargePointsBody = JSON.parse(chargePointsResponse.body)
      chargePointId = chargePointsBody.data.id
      testChargePointsIds.push(chargePointId)
    })

    it('Should return station details for valid ID', async () => {
      const response = await apiClient.get(`/api/stations/${stationId}`, {
        authorization: `Bearer ${authToken}`,
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.success).toBeTruthy()
      expect(body.data).toHaveProperty('id', stationId)
      expect(body.data).toHaveProperty('name')
      expect(body.data).toHaveProperty('latitude')
      expect(body.data).toHaveProperty('longitude')
      expect(body.data).toHaveProperty('address')
      expect(body.data).toHaveProperty('workingHours')
      expect(body.data).toHaveProperty('createdAt')
      expect(body.data).toHaveProperty('updatedAt')
      expect(Array.isArray(body.data.chargePoints)).toBeTruthy()
      expect(body.data.chargePoints.length).toBeGreaterThanOrEqual(1)
      expect(body.data.chargePoints[0]).toHaveProperty('id', chargePointId)
      expect(body.data.chargePoints[0]).toHaveProperty('type')
      expect(body.data.chargePoints[0]).toHaveProperty('powerKW')
      expect(body.data.chargePoints[0]).toHaveProperty('pricePerKwh')
      expect(body.data.chargePoints[0]).toHaveProperty('status')
      expect(body.data.chargePoints[0]).toHaveProperty('createdAt')
      expect(body.data.chargePoints[0]).toHaveProperty('updatedAt')
    })

    it('Should return 404 for non-existent station', async () => {
      const response = await apiClient.get('/api/stations/999999', {
        authorization: `Bearer ${authToken}`,
      })

      expect(response.statusCode).toBe(404)
      const body = JSON.parse(response.body)
      expect(body.success).toBeFalsy()
      expect(body).toHaveProperty('error', 'Station not found')
      expect(body).toHaveProperty('message', 'The requested station does not exist')
    })
  })

  describe('GET /api/stations', () => {
    // Deve retornar a lista de estações com paginação
    it('Return a list of stations with pagination', async () => {
      const response = await apiClient.get('/api/stations')

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body).toHaveProperty('success', true)
      expect(Array.isArray(body.data)).toBeTruthy()
      expect(body.data.length).toBeGreaterThan(0)
      if (body.data.length > 0) {
        expect(body.data[0]).toHaveProperty('id')
        expect(body.data[0]).toHaveProperty('name')
        expect(body.data[0]).toHaveProperty('latitude')
        expect(body.data[0]).toHaveProperty('longitude')
        expect(body.data[0]).toHaveProperty('createdAt')
        expect(body.data[0]).toHaveProperty('address')
        expect(body.data[0]).toHaveProperty('workingHours')
        expect(body.data[0]).toHaveProperty('updatedAt')
        expect(body.data[0]).toHaveProperty('chargePoints')
        expect(Array.isArray(body.data[0].chargePoints)).toBeTruthy()
        expect(body.data[0].chargePoints.length).toBeGreaterThanOrEqual(1)
        expect(body.data[0].chargePoints[0]).toHaveProperty('id')
        expect(body.data[0].chargePoints[0]).toHaveProperty('type')
        expect(body.data[0].chargePoints[0]).toHaveProperty('powerKW')
        expect(body.data[0].chargePoints[0]).toHaveProperty('pricePerKwh')
        expect(body.data[0].chargePoints[0]).toHaveProperty('status')
        expect(body.data[0].chargePoints[0]).toHaveProperty('createdAt')
        expect(body.data[0].chargePoints[0]).toHaveProperty('updatedAt')
      }
      expect(body).toHaveProperty('pagination')
      expect(body.pagination).toHaveProperty('page')
      expect(body.pagination).toHaveProperty('limit')
      expect(body.pagination).toHaveProperty('total')
      expect(body.pagination).toHaveProperty('totalPages')
    })
  })
})
