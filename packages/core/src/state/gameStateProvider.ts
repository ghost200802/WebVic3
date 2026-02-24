import { GameState, PersistedState } from '../models/gameState'
import { GameAction } from './actions'
import { rootReducer } from './reducers'

export type StateListener = (state: GameState, previousState: GameState) => void

export interface IGameStateProvider {
  initialize(initialState: GameState): void
  getState(): GameState
  dispatch(action: GameAction): void
  subscribe(listener: StateListener): () => void
  unsubscribe(listener: StateListener): void
  getPersistedState(): PersistedState
  restorePersistedState(data: PersistedState): void
}

export class GameStateProvider implements IGameStateProvider {
  private _state: GameState | null
  private _listeners: Set<StateListener>
  private _actionQueue: GameAction[]
  private _isProcessingQueue: boolean

  constructor() {
    this._state = null
    this._listeners = new Set()
    this._actionQueue = []
    this._isProcessingQueue = false
  }

  initialize(initialState: GameState): void {
    this._state = initialState
  }

  getState(): GameState {
    if (!this._state) {
      throw new Error('GameStateProvider not initialized. Call initialize() first.')
    }
    return this._state
  }

  dispatch(action: GameAction): void {
    this._actionQueue.push(action)
    this._processActionQueue()
  }

  private _processActionQueue(): void {
    if (this._isProcessingQueue) return
    if (this._actionQueue.length === 0) return

    this._isProcessingQueue = true

    while (this._actionQueue.length > 0) {
      const action = this._actionQueue.shift()
      if (!action) continue

      if (!this._state) return

      const previousState = this._state
      const newState = rootReducer(previousState, action)

      if (newState !== previousState) {
        this._state = newState
        this._notifyListeners(previousState, newState)
      }
    }

    this._isProcessingQueue = false
  }

  subscribe(listener: StateListener): () => void {
    this._listeners.add(listener)

    return () => this.unsubscribe(listener)
  }

  unsubscribe(listener: StateListener): void {
    this._listeners.delete(listener)
  }

  private _notifyListeners(previousState: GameState, newState: GameState): void {
    for (const listener of this._listeners) {
      try {
        listener(newState, previousState)
      } catch (error) {
        console.error('Error in state listener:', error)
      }
    }
  }

  getPersistedState(): PersistedState {
    if (!this._state) {
      throw new Error('GameStateProvider not initialized. Call initialize() first.')
    }

    const { isPaused, timeMultiplier, notifications, researchQueue, ...rest } = this._state

    return {
      id: rest.id,
      name: rest.name,
      version: rest.version,
      date: rest.date,
      era: rest.era,
      tickCount: rest.tickCount,
      tiles: rest.tiles,
      buildings: rest.buildings,
      populations: rest.populations,
      markets: rest.markets,
      technologies: rest.technologies,
      resources: rest.resources,
      settings: rest.settings
    }
  }

  restorePersistedState(data: PersistedState): void {
    const restoredState: GameState = {
      ...data,
      isPaused: false,
      timeMultiplier: 1,
      notifications: [],
      researchQueue: {
        current: null,
        queue: [],
        researchSpeed: 1
      }
    }

    const previousState = this._state
    this._state = restoredState
    if (previousState) {
      this._notifyListeners(previousState, restoredState)
    }
  }

  dispatchBatch(actions: GameAction[]): void {
    this._actionQueue.push(...actions)
    this._processActionQueue()
  }

  hasPendingActions(): boolean {
    return this._actionQueue.length > 0
  }

  getListenerCount(): number {
    return this._listeners.size
  }
}

export const createGameStateProvider = (): IGameStateProvider => {
  return new GameStateProvider()
}
