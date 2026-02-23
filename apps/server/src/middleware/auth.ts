import { FastifyRequest, FastifyReply } from 'fastify'

export interface JwtPayload {
  userId: string
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return reply.status(401).send({ error: 'No token provided' })
    }
    
    const decoded = request.server.jwt.verify<JWTPayload>(token)
    request.userId = decoded.userId
  } catch (error) {
    return reply.status(401).send({ error: 'Invalid token' })
  }
}

interface JWTPayload {
  userId: string
}
