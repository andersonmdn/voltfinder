import 'dotenv/config'
import { buildApp } from './app'

const start = async () => {
  try {
    const app = await buildApp()

    const port = Number(process.env.PORT) || 3000
    const host = process.env.HOST || '0.0.0.0'

    await app.listen({ port, host })

    app.log.info(`Server listening on http://${host}:${port} or http://localhost:${port}`)
    app.log.info(`Documentation available at http://${host}:${port}/docs or http://localhost:${port}/docs`)
  } catch (err) {
    console.error('Error starting server:', err)
    process.exit(1)
  }
}

start()
