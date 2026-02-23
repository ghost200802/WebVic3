import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase } from './database.js'
import type { User, CreateUserInput, LoginInput, UserResponse } from '../models/user.js'

const SALT_ROUNDS = 10

export async function createUser(input: CreateUserInput): Promise<UserResponse> {
  const db = getDatabase()
  
  const existingUser = await db.collection<User>('users').findOne({
    $or: [{ username: input.username }, { email: input.email }]
  })
  
  if (existingUser) {
    if (existingUser.username === input.username) {
      throw new Error('Username already exists')
    }
    throw new Error('Email already exists')
  }
  
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
  const now = new Date()
  
  const user: User = {
    _id: uuidv4(),
    username: input.username,
    email: input.email,
    passwordHash,
    createdAt: now,
    updatedAt: now
  }
  
  await db.collection<User>('users').insertOne(user)
  
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  }
}

export async function validateUser(input: LoginInput): Promise<UserResponse | null> {
  const db = getDatabase()
  
  const user = await db.collection<User>('users').findOne({ username: input.username })
  
  if (!user) {
    return null
  }
  
  const isValid = await bcrypt.compare(input.password, user.passwordHash)
  
  if (!isValid) {
    return null
  }
  
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  }
}

export async function getUserById(userId: string): Promise<UserResponse | null> {
  const db = getDatabase()
  
  const user = await db.collection<User>('users').findOne({ _id: userId })
  
  if (!user) {
    return null
  }
  
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  }
}
