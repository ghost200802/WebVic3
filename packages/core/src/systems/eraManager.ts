import { Era, GameState } from '../models'

export interface EraAdvancementCriteria {
  minPopulation: number
  minTechnologies: number
  requiredTechnologies: string[]
  minBuildings: number
  requiredBuildings: string[]
}

export interface IEraManager {
  getCurrentEra(): Era
  checkAdvancement(state: GameState): Era | null
  advanceTo(era: Era): void
  onEraChange(listener: (newEra: Era) => void): () => void
}

const ERA_ADVANCEMENT_CRITERIA: Record<Era, EraAdvancementCriteria> = {
  [Era.STONE_AGE]: {
    minPopulation: 0,
    minTechnologies: 0,
    requiredTechnologies: [],
    minBuildings: 0,
    requiredBuildings: []
  },
  [Era.BRONZE_AGE]: {
    minPopulation: 100,
    minTechnologies: 1,
    requiredTechnologies: ['stone_tool'],
    minBuildings: 1,
    requiredBuildings: ['workshop']
  },
  [Era.IRON_AGE]: {
    minPopulation: 500,
    minTechnologies: 2,
    requiredTechnologies: ['metal_smelting'],
    minBuildings: 2,
    requiredBuildings: ['mine', 'workshop']
  },
  [Era.CLASSICAL]: {
    minPopulation: 2000,
    minTechnologies: 3,
    requiredTechnologies: ['iron_smelting'],
    minBuildings: 1,
    requiredBuildings: ['academy']
  },
  [Era.MEDIEVAL]: {
    minPopulation: 5000,
    minTechnologies: 4,
    requiredTechnologies: ['writing'],
    minBuildings: 1,
    requiredBuildings: ['university']
  },
  [Era.RENAISSANCE]: {
    minPopulation: 10000,
    minTechnologies: 5,
    requiredTechnologies: ['printing_press'],
    minBuildings: 1,
    requiredBuildings: ['market']
  },
  [Era.INDUSTRIAL]: {
    minPopulation: 50000,
    minTechnologies: 6,
    requiredTechnologies: ['steam_engine'],
    minBuildings: 1,
    requiredBuildings: ['factory']
  },
  [Era.ELECTRICAL]: {
    minPopulation: 100000,
    minTechnologies: 7,
    requiredTechnologies: ['electricity'],
    minBuildings: 1,
    requiredBuildings: ['power_plant']
  },
  [Era.INFORMATION]: {
    minPopulation: 500000,
    minTechnologies: 8,
    requiredTechnologies: ['computer'],
    minBuildings: 1,
    requiredBuildings: ['computer_center']
  },
  [Era.AI_AGE]: {
    minPopulation: 1000000,
    minTechnologies: 9,
    requiredTechnologies: ['ai'],
    minBuildings: 1,
    requiredBuildings: ['ai_research_center']
  }
}

export class EraManager implements IEraManager {
  private currentEra: Era
  private listeners: Set<(newEra: Era) => void>

  constructor(initialEra: Era = Era.STONE_AGE) {
    this.currentEra = initialEra
    this.listeners = new Set()
  }

  getCurrentEra(): Era {
    return this.currentEra
  }

  checkAdvancement(state: GameState): Era | null {
    const eras = Object.values(Era)
    const currentIndex = eras.indexOf(this.currentEra)
    
    for (let i = currentIndex + 1; i < eras.length; i++) {
      const nextEra = eras[i]
      if (this.meetsCriteria(state, nextEra)) {
        return nextEra
      }
    }
    
    return null
  }

  advanceTo(era: Era): void {
    const eras = Object.values(Era)
    const currentIndex = eras.indexOf(this.currentEra)
    const targetIndex = eras.indexOf(era)
    
    if (targetIndex <= currentIndex) {
      return
    }
    
    this.currentEra = era
    this.notifyListeners(era)
  }

  onEraChange(listener: (newEra: Era) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private meetsCriteria(state: GameState, era: Era): boolean {
    const criteria = ERA_ADVANCEMENT_CRITERIA[era]
    
    const totalPopulation = Array.from(state.populations.values())
      .reduce((sum: number, pop: any) => sum + pop.totalPopulation, 0)
    
    if (totalPopulation < criteria.minPopulation) return false
    
    const techCount = state.technologies.size
    if (techCount < criteria.minTechnologies) return false
    
    for (const tech of criteria.requiredTechnologies) {
      if (!state.technologies.has(tech)) return false
    }
    
    const buildingCount = state.buildings.size
    if (buildingCount < criteria.minBuildings) return false
    
    for (const building of criteria.requiredBuildings) {
      const hasBuilding = Array.from(state.buildings.values())
        .some((b: any) => {
          const configId = b.type.split(':')[0]
          return configId === building
        })
      if (!hasBuilding) return false
    }
    
    return true
  }

  private notifyListeners(newEra: Era): void {
    this.listeners.forEach(listener => {
      try {
        listener(newEra)
      } catch (error) {
        console.error('Error in era change listener:', error)
      }
    })
  }
}
