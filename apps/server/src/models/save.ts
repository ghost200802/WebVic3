import type { GameState } from '@webvic3/core'

export interface GameSave {
  _id: string
  userId: string
  name: string
  gameState: GameState
  createdAt: Date
  updatedAt: Date
}

export interface CreateSaveInput {
  name: string
  gameState: GameState
}

export interface UpdateSaveInput {
  name?: string
  gameState?: GameState
}

export interface SaveResponse {
  id: string
  userId: string
  name: string
  createdAt: Date
  updatedAt: Date
}
