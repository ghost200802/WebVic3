import { Era, GameDate } from './baseTypes'
import { Tile } from './tile'
import { Building } from './building'
import { Population } from './population'
import { Market } from './market'
import { ResearchQueue } from './technology'

export interface GameState {
  id: string
  name: string
  version: string
  
  date: GameDate
  era: Era
  tickCount: number
  isPaused: boolean
  timeMultiplier: number
  
  tiles: Map<string, Tile>
  buildings: Map<string, Building>
  populations: Map<string, Population>
  markets: Map<string, Market>
  technologies: Set<string>
  researchQueue: ResearchQueue
  
  resources: {
    money: number
    goods: Map<string, number>
  }
  
  settings: GameSettings
  notifications: Notification[]
}

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: number
}

export interface GameSettings {
  gameSpeed: number
  autoSaveInterval: number
  difficulty: string
  enabledFeatures: {
    events: boolean
    disasters: boolean
    wars: boolean
    trade: boolean
  }
}

export interface PersistedState {
  id: string
  name: string
  version: string
  
  date: GameDate
  era: Era
  tickCount: number
  
  tiles: Map<string, Tile>
  buildings: Map<string, Building>
  populations: Map<string, Population>
  markets: Map<string, Market>
  technologies: Set<string>
  
  resources: {
    money: number
    goods: Map<string, number>
  }
  
  settings: GameSettings
}

export const createInitialState = (): Omit<GameState, 'id' | 'name' | 'version'> => ({
  date: { year: 1, month: 1, day: 1 },
  era: Era.STONE_AGE,
  tickCount: 0,
  isPaused: false,
  timeMultiplier: 1,
  tiles: new Map(),
  buildings: new Map(),
  populations: new Map(),
  markets: new Map(),
  technologies: new Set(),
  researchQueue: {
    current: null,
    queue: [],
    researchSpeed: 1
  },
  resources: {
    money: 1000,
    goods: new Map()
  },
  settings: {
    gameSpeed: 1,
    autoSaveInterval: 300,
    difficulty: 'normal',
    enabledFeatures: {
      events: true,
      disasters: true,
      wars: true,
      trade: true
    }
  },
  notifications: []
})

export const cloneGameState = (state: GameState): GameState => {
  return {
    ...state,
    date: { ...state.date },
    tiles: new Map(state.tiles),
    buildings: new Map(state.buildings),
    populations: new Map(state.populations),
    markets: new Map(state.markets),
    technologies: new Set(state.technologies),
    researchQueue: {
      current: state.researchQueue.current ? { ...state.researchQueue.current } : null,
      queue: [...state.researchQueue.queue],
      researchSpeed: state.researchQueue.researchSpeed
    },
    resources: {
      money: state.resources.money,
      goods: new Map(state.resources.goods)
    },
    settings: {
      ...state.settings,
      enabledFeatures: { ...state.settings.enabledFeatures }
    },
    notifications: [...state.notifications]
  }
}
