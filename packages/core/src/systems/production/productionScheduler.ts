import { Building, BuildingType } from '../../models'
import { ProductionResult } from './buildingManager'

export interface IProductionScheduler {
  scheduleProduction(building: Building): ProductionResult
  scheduleAllProduction(buildings: Building[]): ProductionResult[]
}

export class ProductionScheduler implements IProductionScheduler {
  scheduleProduction(building: Building): ProductionResult {
    const workers = building.baseWorkers
    const throughput = building.baseThroughput
    const levelBonus = building.level * 0.1
    
    const totalEfficiency = 1 + levelBonus

    const inputs = new Map<string, number>()
    const outputs = new Map<string, number>()

    if (building.type === BuildingType.FORESTRY) {
      outputs.set('wood', Math.floor(throughput * totalEfficiency * workers / 10))
    } else if (building.type === BuildingType.FARM) {
      outputs.set('food', Math.floor(throughput * totalEfficiency * workers / 10))
    } else if (building.type === BuildingType.MINE || building.type === BuildingType.QUARRY) {
      outputs.set('stone', Math.floor(throughput * totalEfficiency * workers / 10))
    }

    return {
      inputs,
      outputs,
      efficiency: totalEfficiency
    }
  }

  scheduleAllProduction(buildings: Building[]): ProductionResult[] {
    return buildings.map(building => this.scheduleProduction(building))
  }
}
