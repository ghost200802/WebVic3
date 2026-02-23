import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middleware/auth.js'
import {
  createSave,
  getSavesByUserId,
  getSaveById,
  updateSave,
  deleteSave,
  getSaveGameState
} from '../services/saveService.js'
import type { CreateSaveInput, UpdateSaveInput } from '../models/save.js'

export async function saveRoutes(server: FastifyInstance) {
  server.addHook('preHandler', authMiddleware)

  server.get('/', async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }
    
    const saves = await getSavesByUserId(request.userId)
    return reply.send({ saves })
  })

  server.post<{ Body: CreateSaveInput }>(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'gameState'],
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 100 },
            gameState: { type: 'object' }
          }
        }
      }
    },
    async (request, reply) => {
      if (!request.userId) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }
      
      const save = await createSave(request.userId, request.body)
      return reply.status(201).send({ save })
    }
  )

  server.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }
    
    const save = await getSaveById(request.params.id, request.userId)
    
    if (!save) {
      return reply.status(404).send({ error: 'Save not found' })
    }
    
    return reply.send({ save })
  })

  server.get<{ Params: { id: string } }>('/:id/state', async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }
    
    const gameState = await getSaveGameState(request.params.id, request.userId)
    
    if (!gameState) {
      return reply.status(404).send({ error: 'Save not found' })
    }
    
    return reply.send({ gameState })
  })

  server.put<{ Params: { id: string }; Body: UpdateSaveInput }>(
    '/:id',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 100 },
            gameState: { type: 'object' }
          }
        }
      }
    },
    async (request, reply) => {
      if (!request.userId) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }
      
      const save = await updateSave(request.params.id, request.userId, request.body)
      
      if (!save) {
        return reply.status(404).send({ error: 'Save not found' })
      }
      
      return reply.send({ save })
    }
  )

  server.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }
    
    const deleted = await deleteSave(request.params.id, request.userId)
    
    if (!deleted) {
      return reply.status(404).send({ error: 'Save not found' })
    }
    
    return reply.status(204).send()
  })
}
