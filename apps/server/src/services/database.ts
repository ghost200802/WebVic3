import { MongoClient, Db } from 'mongodb'
import { config } from '../config/index.js'

let db: Db | null = null
let client: MongoClient | null = null

export async function connectDatabase(): Promise<Db> {
  if (db) return db

  client = new MongoClient(config.mongodb.uri)
  await client.connect()
  db = client.db()

  await db.collection('users').createIndex({ username: 1 }, { unique: true })
  await db.collection('users').createIndex({ email: 1 }, { unique: true })
  await db.collection('saves').createIndex({ userId: 1 })
  await db.collection('saves').createIndex({ userId: 1, createdAt: -1 })

  console.log('Connected to MongoDB')
  return db
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectDatabase first.')
  }
  return db
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close()
    db = null
    client = null
  }
}
