import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Fastify from 'fastify'
import { MongoClient } from 'mongodb'
import { config } from '../config/index.js'
import { authRoutes } from '../routes/auth.js'
import { saveRoutes } from '../routes/saves.js'
import { closeDatabase, connectDatabase } from '../services/database.js'

const createTestServer = async () => {
  const server = Fastify({ logger: false })
  
  const cors = await import('@fastify/cors')
  const jwt = await import('@fastify/jwt')
  
  await server.register(cors.default, { origin: true })
  await server.register(jwt.default, { secret: config.jwt.secret })
  
  server.register(authRoutes, { prefix: '/api/auth' })
  server.register(saveRoutes, { prefix: '/api/saves' })
  
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })
  
  return server
}

describe('Server', () => {
  let server: Awaited<ReturnType<typeof createTestServer>>
  let token: string
  let userId: string

  beforeAll(async () => {
    await connectDatabase()
    server = await createTestServer()
  })

  afterAll(async () => {
    await server.close()
    await closeDatabase()
  })

  describe('Health Check', () => {
    it('should return ok status', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/health'
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toHaveProperty('status', 'ok')
    })
  })

  describe('Auth Routes', () => {
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    }

    it('should register a new user', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: testUser
      })

      expect(response.statusCode).toBe(201)
      const body = response.json()
      expect(body).toHaveProperty('user')
      expect(body.user).toHaveProperty('username', testUser.username)
      expect(body.user).toHaveProperty('email', testUser.email)
    })

    it('should fail to register with existing username', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: testUser
      })

      expect(response.statusCode).toBe(400)
    })

    it('should login with correct credentials', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          username: testUser.username,
          password: testUser.password
        }
      })

      expect(response.statusCode).toBe(200)
      const body = response.json()
      expect(body).toHaveProperty('token')
      expect(body).toHaveProperty('user')
      
      token = body.token
      userId = body.user.id
    })

    it('should fail to login with wrong password', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          username: testUser.username,
          password: 'wrongpassword'
        }
      })

      expect(response.statusCode).toBe(401)
    })
  })

  describe('Save Routes', () => {
    let saveId: string

    it('should create a save', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/saves',
        headers: {
          authorization: `Bearer ${token}`
        },
        payload: {
          name: 'Test Save',
          gameState: {
            id: 'game_1',
            name: 'Test Game',
            version: '1.0.0',
            date: { year: 1, month: 1, day: 1 },
            era: 'stone_age',
            tickCount: 0,
            tiles: [],
            buildings: [],
            populations: [],
            markets: [],
            technologies: [],
            researchQueue: { current: null, queue: [], researchSpeed: 1.0 },
            resources: { money: 1000, goods: {} },
            settings: {
              gameSpeed: 1,
              autoSaveInterval: 5,
              difficulty: 'normal',
              enabledFeatures: { events: true, disasters: true, wars: false, trade: true }
            }
          }
        }
      })

      expect(response.statusCode).toBe(201)
      const body = response.json()
      expect(body).toHaveProperty('save')
      expect(body.save).toHaveProperty('name', 'Test Save')
      
      saveId = body.save.id
    })

    it('should get all saves for user', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/saves',
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      expect(response.statusCode).toBe(200)
      const body = response.json()
      expect(body).toHaveProperty('saves')
      expect(Array.isArray(body.saves)).toBe(true)
      expect(body.saves.length).toBeGreaterThan(0)
    })

    it('should get a specific save', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/api/saves/${saveId}`,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      expect(response.statusCode).toBe(200)
      const body = response.json()
      expect(body).toHaveProperty('save')
      expect(body.save).toHaveProperty('id', saveId)
    })

    it('should update a save', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: `/api/saves/${saveId}`,
        headers: {
          authorization: `Bearer ${token}`
        },
        payload: {
          name: 'Updated Save Name'
        }
      })

      expect(response.statusCode).toBe(200)
      const body = response.json()
      expect(body.save).toHaveProperty('name', 'Updated Save Name')
    })

    it('should fail without authentication', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/saves'
      })

      expect(response.statusCode).toBe(401)
    })

    it('should delete a save', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/saves/${saveId}`,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      expect(response.statusCode).toBe(204)
    })

    it('should return 404 for deleted save', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/api/saves/${saveId}`,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      expect(response.statusCode).toBe(404)
    })
  })
})
