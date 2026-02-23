import '@fastify/jwt'
import { FastifyRequest } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    jwt: {
      sign(payload: Record<string, unknown>): string
      verify<P = unknown>(token: string): P
    }
  }
  
  interface FastifyRequest {
    userId?: string
  }
}
