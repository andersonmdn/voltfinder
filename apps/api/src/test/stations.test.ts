import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { apiClient } from './helpers/apiClient'

describe('Station Routes', () => {
  let authToken: string
  const testStationIds: string[] = []

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
    // Note: In a real scenario, you might want to clean up test stations
    // This would require cleanup endpoints or direct database access
  })

  describe('GET /api/stations', () => {
    it('should return stations list', async () => {
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
        expect(body.data[0]).toHaveProperty('updatedAt')
      }
      expect(body).toHaveProperty('pagination')
      expect(body.pagination).toHaveProperty('page')
      expect(body.pagination).toHaveProperty('limit')
      expect(body.pagination).toHaveProperty('total')
      expect(body.pagination).toHaveProperty('totalPages')
    })
  })

  describe('POST /api/stations', () => {
    it('should create a new station with valid data', async () => {
      const stationData = {
        name: `Test Station ${Date.now()}`,
        latitude: 40.7128,
        longitude: -74.006,
      }

      const response = await apiClient.post('/api/stations', stationData, {
        authorization: `Bearer ${authToken}`,
      })

      expect(response.statusCode).toBe(201)
      const body = JSON.parse(response.body)
      expect(body.success).toBeTruthy()
      expect(body.data.name).toBe(stationData.name)
      expect(body.data.latitude).toBe(stationData.latitude)
      expect(body.data.longitude).toBe(stationData.longitude)

      // Store for cleanup
      if (body.id) {
        testStationIds.push(body.id)
      }
    })

    it('should return 400 for invalid coordinates', async () => {
      const response = await apiClient.post(
        '/api/stations',
        {
          name: 'Invalid Station',
          latitude: 200, // Invalid latitude
          longitude: -74.006,
        },
        {
          authorization: `Bearer ${authToken}`,
        }
      )

      expect(response.statusCode).toBe(400)
    })

    it('should return 400 for missing required fields', async () => {
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
    })

    it('should return 401 for unauthenticated request', async () => {
      const response = await apiClient.post('/api/stations', {
        name: 'Test Station',
        latitude: 40.7128,
        longitude: -74.006,
      })

      expect(response.statusCode).toBe(401)
    })
  })

  describe('GET /api/stations/:id', () => {
    let stationId: string

    beforeAll(async () => {
      // Create a station for testing
      const stationData = {
        name: `Test Station for Get ${Date.now()}`,
        latitude: 40.7128,
        longitude: -74.006,
      }

      const response = await apiClient.post('/api/stations', stationData, {
        authorization: `Bearer ${authToken}`,
      })

      const station = JSON.parse(response.body)
      stationId = station.data.id
      testStationIds.push(stationId)
    })

    it('should return station details for valid ID', async () => {
      const response = await apiClient.get(`/api/stations/${stationId}`, {
        authorization: `Bearer ${authToken}`,
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.success).toBeTruthy()
      expect(body.data.id).toBe(stationId)
      expect(body.data.name).toContain('Test Station for Get')
    })

    it('should return 404 for non-existent station', async () => {
      const response = await apiClient.get('/api/stations/999999', {
        authorization: `Bearer ${authToken}`,
      })

      expect(response.statusCode).toBe(404)
    })

    it('should return station details for unauthenticated request', async () => {
      const response = await apiClient.get(`/api/stations/${stationId}`)

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.success).toBeTruthy()
    })
  })
})
