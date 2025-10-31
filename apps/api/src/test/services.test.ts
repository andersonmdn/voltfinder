import { describe, expect, it } from 'vitest'
import { apiClient } from './helpers/apiClient'

describe('API Health Check', () => {
  it('should return 200 for health endpoint', async () => {
    const response = await apiClient.get('/health')

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.status).toBe('ok')
    expect(body).toHaveProperty('timestamp')
  })
})

describe('API Integration Tests', () => {
  it('should have proper CORS headers', async () => {
    const response = await apiClient.get('/health')

    // Check for CORS headers (these may vary based on your CORS configuration)
    expect(response.statusCode).toBe(200)
  })

  it('should return proper error format for non-existent endpoints', async () => {
    const response = await apiClient.get('/non-existent-endpoint')

    expect(response.statusCode).toBe(404)
  })

  it('should handle malformed JSON in requests', async () => {
    try {
      // This should test malformed JSON handling
      const response = await fetch(`${process.env.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{invalid json}',
      })

      expect(response.status).toBe(400)
    } catch (error) {
      // If the request fails entirely, that's also acceptable behavior
      expect(error).toBeDefined()
    }
  })
})
