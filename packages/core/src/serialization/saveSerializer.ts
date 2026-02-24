import { GameState } from '../models'

export interface SaveData {
  version: string
  timestamp: number
  state: any
}

export interface ISaveSerializer {
  serialize(state: GameState): string
  deserialize(json: string): GameState
}

export class SaveSerializer implements ISaveSerializer {
  private readonly VERSION = '1.0.0'

  serialize(state: GameState): string {
    const saveData: SaveData = {
      version: this.VERSION,
      timestamp: Date.now(),
      state: this.serializeState(state)
    }

    return JSON.stringify(saveData, null, 2)
  }

  deserialize(json: string): GameState {
    try {
      const saveData: SaveData = JSON.parse(json)
      
      if (!this.validateSaveData(saveData)) {
        throw new Error('Invalid save data format')
      }

      return this.deserializeState(saveData.state)
    } catch (error) {
      throw new Error(`Failed to deserialize save: ${error}`)
    }
  }

  private serializeState(state: GameState): any {
    return {
      id: state.id,
      name: state.name,
      version: state.version,
      date: state.date,
      era: state.era,
      tickCount: state.tickCount,
      isPaused: state.isPaused,
      timeMultiplier: state.timeMultiplier,
      tiles: this.serializeMap(state.tiles),
      buildings: this.serializeMap(state.buildings),
      populations: this.serializeMap(state.populations),
      markets: this.serializeMap(state.markets),
      technologies: Array.from(state.technologies),
      researchQueue: {
        current: state.researchQueue.current,
        queue: state.researchQueue.queue,
        researchSpeed: state.researchQueue.researchSpeed
      },
      resources: {
        money: state.resources.money,
        goods: this.serializeMap(state.resources.goods)
      },
      settings: state.settings,
      notifications: state.notifications
    }
  }

  private deserializeState(data: any): GameState {
    return {
      id: data.id,
      name: data.name,
      version: data.version,
      date: data.date,
      era: data.era,
      tickCount: data.tickCount,
      isPaused: data.isPaused || false,
      timeMultiplier: data.timeMultiplier || 1,
      tiles: this.deserializeMap(data.tiles),
      buildings: this.deserializeMap(data.buildings),
      populations: this.deserializeMap(data.populations),
      markets: this.deserializeMap(data.markets),
      technologies: new Set(data.technologies),
      researchQueue: data.researchQueue,
      resources: {
        money: data.resources.money,
        goods: this.deserializeMap(data.resources.goods)
      },
      settings: data.settings,
      notifications: data.notifications || []
    }
  }

  private serializeMap<T>(map: Map<string, T>): Array<[string, T]> {
    return Array.from(map.entries())
  }

  private deserializeMap<T>(data: Array<[string, T]>): Map<string, T> {
    return new Map(data)
  }

  private validateSaveData(data: any): boolean {
    if (!data) return false
    if (typeof data !== 'object') return false
    if (!data.version) return false
    if (!data.timestamp) return false
    if (!data.state) return false
    if (typeof data.state !== 'object') return false
    return true
  }
}
