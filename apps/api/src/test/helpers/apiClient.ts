import { config } from 'dotenv'
import { join } from 'path'

// Load test environment variables
config({ path: join(__dirname, '..', '..', '.env.test') })

export interface TestResponse {
  statusCode: number
  body: string
  headers: Record<string, string>
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  payload?: any
  headers?: Record<string, string>
}

export class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || 'http://localhost:3000'
  }

  async request(options: RequestOptions): Promise<TestResponse> {
    const { method, url, payload, headers = {} } = options

    const fullUrl = `${this.baseUrl}${url}`

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    if (payload && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(payload)
    }

    try {
      const response = await fetch(fullUrl, fetchOptions)
      const body = await response.text()

      return {
        statusCode: response.status,
        body,
        headers: Object.fromEntries(response.headers.entries()),
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to connect to API at ${fullUrl}: ${message}`)
    }
  }

  // Helper methods for common HTTP methods
  async get(url: string, headers?: Record<string, string>) {
    return this.request({ method: 'GET', url, headers })
  }

  async post(url: string, payload?: any, headers?: Record<string, string>) {
    return this.request({ method: 'POST', url, payload, headers })
  }

  async put(url: string, payload?: any, headers?: Record<string, string>) {
    return this.request({ method: 'PUT', url, payload, headers })
  }

  async delete(url: string, headers?: Record<string, string>) {
    return this.request({ method: 'DELETE', url, headers })
  }

  async patch(url: string, payload?: any, headers?: Record<string, string>) {
    return this.request({ method: 'PATCH', url, payload, headers })
  }
}

// Global instance for tests
export const apiClient = new ApiClient()

// Helper function to check if API is running
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await apiClient.get('/health')
    return response.statusCode === 200
  } catch {
    return false
  }
}
