import { FastifyInstance } from 'fastify'
import { createUser, validateUser } from '../services/userService.js'
import type { CreateUserInput, LoginInput } from '../models/user.js'

export async function authRoutes(server: FastifyInstance) {
  server.post<{ Body: CreateUserInput }>(
    '/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        const user = await createUser(request.body)
        return reply.status(201).send({ user })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed'
        return reply.status(400).send({ error: message })
      }
    }
  )

  server.post<{ Body: LoginInput }>(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' }
          }
        }
      }
    },
    async (request, reply) => {
      const user = await validateUser(request.body)
      
      if (!user) {
        return reply.status(401).send({ error: 'Invalid credentials' })
      }
      
      const token = server.jwt.sign({ userId: user.id })
      
      return reply.send({ user, token })
    }
  )
}
