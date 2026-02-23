import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { config } from './config/index.js'
import { connectDatabase, closeDatabase } from './services/database.js'
import { authRoutes } from './routes/auth.js'
import { saveRoutes } from './routes/saves.js'

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  }
})

await server.register(cors, {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
})

await server.register(jwt, {
  secret: config.jwt.secret
})

await server.register(swagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'WebVic3 API',
      description: 'WebVic3 game server API',
      version: '1.0.0'
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server'
      }
    ],
    tags: [
      { name: 'auth', description: 'Authentication endpoints' },
      { name: 'saves', description: 'Game save management' }
    ]
  }
})

await server.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true
  }
})

server.register(authRoutes, { prefix: '/api/auth' })
server.register(saveRoutes, { prefix: '/api/saves' })

server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

server.get('/', async () => {
  return {
    name: 'WebVic3 API',
    version: '1.0.0',
    docs: '/docs'
  }
})

const start = async () => {
  try {
    await connectDatabase()
    
    await server.listen({ port: config.port, host: config.host })
    
    console.log(`Server running at http://${config.host}:${config.port}`)
    console.log(`API docs available at http://${config.host}:${config.port}/docs`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

const gracefulShutdown = async () => {
  console.log('\nShutting down gracefully...')
  await closeDatabase()
  await server.close()
  process.exit(0)
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

start()
