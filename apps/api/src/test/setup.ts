import { config } from 'dotenv'
import { join } from 'path'
import { afterAll, beforeAll } from 'vitest'
import { checkApiHealth } from './helpers/apiClient'

// Load test environment variables
config({ path: join(__dirname, '..', '..', '.env.test') })

beforeAll(async () => {
  // Setup test environment
  process.env.NODE_ENV = 'test'

  console.log('🧪 Setting up tests...')
  console.log(`📡 API Base URL: ${process.env.API_BASE_URL}`)

  // Check if API is running
  const isApiRunning = await checkApiHealth()
  if (!isApiRunning) {
    throw new Error(
      `
❌ API is not running at ${process.env.API_BASE_URL}

Please start the API server before running tests:
1. Make sure you have a .env.test file with proper configuration
2. Start the API server: pnpm dev:api
3. Then run the tests

Expected API URL: ${process.env.API_BASE_URL}
    `.trim()
    )
  }

  console.log('✅ API is running and accessible')
})

afterAll(async () => {
  console.log('🧹 Cleaning up tests...')
  // Additional cleanup can be added here if needed
})
