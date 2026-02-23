import Fastify from 'fastify'
import cors from '@fastify/cors'

const fastify = Fastify({
  logger: true
})

await fastify.register(cors)

fastify.get('/', async () => {
  return { message: 'Welcome to WebVic3 API' }
})

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001')
    const host = '0.0.0.0'
    await fastify.listen({ port, host })
    fastify.log.info(`Server running at http://${host}:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
