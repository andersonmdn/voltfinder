import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { apiClient } from './helpers/apiClient'

describe('Auth Routes', () => {
  // Store test data for cleanup
  const testEmails: string[] = []

  beforeAll(async () => {
    console.log('🔐 Setting up Auth tests...')
  })

  afterAll(async () => {
    console.log('🧹 Cleaning up Auth test data...')
    // Note: In a real scenario, you might want to clean up test users
    // This would require a cleanup endpoint or direct database access
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User',
      }
      testEmails.push(userData.email)

      const response = await apiClient.post('/api/auth/register', userData)

      expect(response.statusCode).toBe(201)
      const body = JSON.parse(response.body)
      expect(body).toHaveProperty('success', true)
      expect(body).toHaveProperty('message')
      expect(body).toHaveProperty('data')
      expect(body.data.id).toBeGreaterThan(0)
      expect(body.data.email).toBe(userData.email)
      expect(body.data.name).toBe(userData.name)
      expect(body).not.toHaveProperty('password')
    })

    it('should return 400 for invalid email', async () => {
      const response = await apiClient.post('/api/auth/register', {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      })

      expect(response.statusCode).toBe(400)
      const body = JSON.parse(response.body)
      expect(body).toHaveProperty('success', false)
      expect(body).toHaveProperty('message', 'body/email Invalid email address')
      expect(body).toHaveProperty('error', 'Validation Error')
    })

    it('should return 400 for missing required fields', async () => {
      const response = await apiClient.post('/api/auth/register', {
        email: `incomplete-${Date.now()}@example.com`,
        // missing password and name
      })

      expect(response.statusCode).toBe(400)
      const body = JSON.parse(response.body)
      expect(body).toHaveProperty('success', false)
      expect(body).toHaveProperty(
        'message',
        'body/name Invalid input: expected string, received undefined, body/password Invalid input: expected string, received undefined'
      )
      expect(body).toHaveProperty('error', 'Validation Error')
    })

    it('should return 409 for duplicate email', async () => {
      const email = `duplicate-${Date.now()}@example.com`
      testEmails.push(email)

      // First registration
      await apiClient.post('/api/auth/register', {
        email,
        password: 'password123',
        name: 'Test User',
      })

      // Second registration with same email
      const response = await apiClient.post('/api/auth/register', {
        email,
        password: 'password123',
        name: 'Another User',
      })

      expect(response.statusCode).toBe(409)
      const body = JSON.parse(response.body)
      expect(body).toHaveProperty('success', false)
      expect(body).toHaveProperty('message', 'A user with this email already exists')
      expect(body).toHaveProperty('error', 'Email already in use')
    })
  })

  describe('POST /api/auth/login', () => {
    const loginTestUser = {
      email: `login-test-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Login Test User',
    }

    beforeAll(async () => {
      // Create a user for login tests
      testEmails.push(loginTestUser.email)
      await apiClient.post('/api/auth/register', loginTestUser)
    })

    it('should login with valid credentials', async () => {
      const response = await apiClient.post('/api/auth/login', {
        email: loginTestUser.email,
        password: loginTestUser.password,
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body).toHaveProperty('success', true)
      expect(body).toHaveProperty('data')
      expect(body.data).toHaveProperty('token')
      expect(body.data).toHaveProperty('refreshToken')
      expect(body.data).toHaveProperty('user')
      expect(body.data.user.id).toBeGreaterThan(0)
      expect(body.data.user.email).toBe(loginTestUser.email)
      expect(body.data.user.name).toBe(loginTestUser.name)
    })

    it('should return 401 for invalid password', async () => {
      const response = await apiClient.post('/api/auth/login', {
        email: loginTestUser.email,
        password: 'wrongpassword',
      })

      expect(response.statusCode).toBe(401)
      const body = JSON.parse(response.body)
      expect(body).toHaveProperty('success', false)
      expect(body).toHaveProperty('message', 'Email or password is incorrect')
      expect(body).toHaveProperty('error', 'Invalid credentials')
    })

    it('should return 404 for non-existent user', async () => {
      const response = await apiClient.post('/api/auth/login', {
        email: `nonexistent-${Date.now()}@example.com`,
        password: 'password123',
      })

      expect(response.statusCode).toBe(401)
      const body = JSON.parse(response.body)
      expect(body).toHaveProperty('success', false)
      expect(body).toHaveProperty('message', 'Email or password is incorrect')
      expect(body).toHaveProperty('error', 'Invalid credentials')
    })

    it('should return 400 for invalid email format', async () => {
      const response = await apiClient.post('/api/auth/login', {
        email: 'invalid-email',
        password: 'password123',
      })

      expect(response.statusCode).toBe(400)
      const body = JSON.parse(response.body)
      expect(body).toHaveProperty('success', false)
      expect(body).toHaveProperty('message', 'body/email Invalid email address')
      expect(body).toHaveProperty('error', 'Validation Error')
    })
  })
})
