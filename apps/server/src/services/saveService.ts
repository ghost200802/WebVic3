import { v4 as uuidv4 } from 'uuid'
import { getDatabase } from './database.js'
import type { GameSave, CreateSaveInput, UpdateSaveInput, SaveResponse } from '../models/save.js'
import type { GameState } from '@webvic3/core'

export async function createSave(userId: string, input: CreateSaveInput): Promise<SaveResponse> {
  const db = getDatabase()
  const now = new Date()
  
  const save: GameSave = {
    _id: uuidv4(),
    userId,
    name: input.name,
    gameState: input.gameState,
    createdAt: now,
    updatedAt: now
  }
  
  await db.collection<GameSave>('saves').insertOne(save)
  
  return {
    id: save._id,
    userId: save.userId,
    name: save.name,
    createdAt: save.createdAt,
    updatedAt: save.updatedAt
  }
}

export async function getSavesByUserId(userId: string): Promise<SaveResponse[]> {
  const db = getDatabase()
  
  const saves = await db
    .collection<GameSave>('saves')
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()
  
  return saves.map(save => ({
    id: save._id,
    userId: save.userId,
    name: save.name,
    createdAt: save.createdAt,
    updatedAt: save.updatedAt
  }))
}

export async function getSaveById(saveId: string, userId: string): Promise<GameSave | null> {
  const db = getDatabase()
  
  return db.collection<GameSave>('saves').findOne({ _id: saveId, userId })
}

export async function updateSave(
  saveId: string,
  userId: string,
  input: UpdateSaveInput
): Promise<SaveResponse | null> {
  const db = getDatabase()
  
  const updateData: Partial<GameSave> = {
    updatedAt: new Date()
  }
  
  if (input.name) {
    updateData.name = input.name
  }
  if (input.gameState) {
    updateData.gameState = input.gameState
  }
  
  const result = await db.collection<GameSave>('saves').findOneAndUpdate(
    { _id: saveId, userId },
    { $set: updateData },
    { returnDocument: 'after' }
  )
  
  if (!result) {
    return null
  }
  
  return {
    id: result._id,
    userId: result.userId,
    name: result.name,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt
  }
}

export async function deleteSave(saveId: string, userId: string): Promise<boolean> {
  const db = getDatabase()
  
  const result = await db.collection<GameSave>('saves').deleteOne({ _id: saveId, userId })
  
  return result.deletedCount > 0
}

export async function getSaveGameState(saveId: string, userId: string): Promise<GameState | null> {
  const save = await getSaveById(saveId, userId)
  return save?.gameState || null
}
