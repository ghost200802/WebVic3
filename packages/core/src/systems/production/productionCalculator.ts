import { Building, PRODUCTION_METHODS, Era } from '../../models'
import { ProductionResult } from './buildingManager'

export interface IProductionCalculator {
  calculateProduction(
    building: Building,
    workers: number,
    era: Era,
    educationLevel: number,
    toolAvailability: number
  ): ProductionResult
  calculateUpgradeCost(building: Building): Record<string, number>
}

export class ProductionCalculator implements IProductionCalculator {
  private readonly ERA_BONUS: Record<Era, number> = {
    [Era.STONE_AGE]: 1.0,
    [Era.BRONZE_AGE]: 1.1,
    [Era.IRON_AGE]: 1.2,
    [Era.CLASSICAL]: 1.3,
    [Era.MEDIEVAL]: 1.4,
    [Era.RENAISSANCE]: 1.5,
    [Era.INDUSTRIAL]: 1.7,
    [Era.ELECTRICAL]: 1.8,
    [Era.INFORMATION]: 1.9,
    [Era.AI_AGE]: 2.0
  }

  private readonly EDUCATION_BONUS: Record<number, number> = {
    0: 0.8,
    1: 0.9,
    2: 1.0,
    3: 1.1,
    4: 1.2,
    5: 1.3,
    6: 1.4
  }

  calculateProduction(
    building: Building,
    workers: number,
    era: Era,
    educationLevel: number,
    toolAvailability: number
  ): ProductionResult {
    const activeMethodId = building.productionMethods[0]
    const method = PRODUCTION_METHODS[activeMethodId]
    
    if (!method) {
      return {
        inputs: new Map(),
        outputs: new Map(),
        efficiency: 0
      }
    }

    const eraBonus = this.ERA_BONUS[era]
    const educationBonus = this.EDUCATION_BONUS[Math.min(educationLevel, 6)]
    const efficiency = eraBonus * educationBonus * toolAvailability * method.workerEfficiency

    const throughput = building.baseThroughput * efficiency * (workers / building.baseWorkers)
    const levelBonus = 1 + (building.level - 1) * 0.1

    const adjustedThroughput = throughput * levelBonus

    const inputs = new Map<string, number>()
    const outputs = new Map<string, number>()

    for (const [goodsId, amount] of Object.entries(method.inputs)) {
      const adjustedAmount = amount * adjustedThroughput
      inputs.set(goodsId, adjustedAmount)
    }

    for (const [goodsId, amount] of Object.entries(method.outputs)) {
      const adjustedAmount = amount * adjustedThroughput
      outputs.set(goodsId, adjustedAmount)
    }

    return {
      inputs,
      outputs,
      efficiency
    }
  }

  calculateUpgradeCost(building: Building): Record<string, number> {
    const level = building.level
    const multiplier = Math.pow(1.5, level - 1)
    
    const costs: Record<string, number> = {}
    for (const [goodsId, amount] of Object.entries(building.constructionCost)) {
      costs[goodsId] = amount * multiplier
    }
    
    return costs
  }
}
