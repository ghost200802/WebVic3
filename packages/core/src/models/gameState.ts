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
