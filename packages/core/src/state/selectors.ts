import { GameState } from '../models/gameState'
import { BuildingType } from '../models/baseTypes'

export interface IStateSelector<T> {
  select(state: GameState): T
  subscribe(listener: (value: T) => void): () => void
}

export class StateSelector<T> implements IStateSelector<T> {
  private _selectorFn: (state: GameState) => T
  private _provider: any
  private _lastValue: T | null
  private _unsubscribe: (() => void) | null

  constructor(selectorFn: (state: GameState) => T, provider: any) {
    this._selectorFn = selectorFn
    this._provider = provider
    this._lastValue = null
    this._unsubscribe = null
  }

  select(state: GameState): T {
    return this._selectorFn(state)
  }

  subscribe(listener: (value: T) => void): () => void {
    const stateListener = (newState: GameState) => {
      const newValue = this._selectorFn(newState)
      
      if (this._lastValue !== newValue) {
        this._lastValue = newValue
        listener(newValue)
      }
    }

    this._unsubscribe = this._provider.subscribe(stateListener)
    
    return () => {
      if (this._unsubscribe) {
        this._unsubscribe()
        this._unsubscribe = null
      }
    }
  }
}

export const createSelector = <T>(
  selectorFn: (state: GameState) => T,
  provider: any
): IStateSelector<T> => {
  return new StateSelector(selectorFn, provider)
}

export const selectTotalPopulation = (state: GameState): number => {
  let total = 0
  for (const population of state.populations.values()) {
    total += population.totalPopulation
  }
  return total
}

export const selectEmployedPopulation = (state: GameState): number => {
  let total = 0
  for (const population of state.populations.values()) {
    total += population.employment.employed
  }
  return total
}

export const selectUnemployedPopulation = (state: GameState): number => {
  let total = 0
  for (const population of state.populations.values()) {
    total += population.employment.unemployed
  }
  return total
}

export const selectEmploymentRate = (state: GameState): number => {
  const total = selectTotalPopulation(state)
  const employed = selectEmployedPopulation(state)
  
  if (total === 0) return 0
  return (employed / total) * 100
}

export const selectTotalBuildings = (state: GameState): number => {
  return state.buildings.size
}

export const selectBuildingsByType = (state: GameState, type: BuildingType): number => {
  let count = 0
  for (const building of state.buildings.values()) {
    if (building.type === type) count++
  }
  return count
}

export const selectBuildingWorkers = (state: GameState, buildingId: string): number => {
  let workers = 0
  
  for (const population of state.populations.values()) {
    for (const group of population.groups) {
      if (group.workplace === buildingId) {
        workers += group.size
      }
    }
  }
  
  return workers
}

export const selectTotalWorkers = (state: GameState): number => {
  let workers = 0
  
  for (const population of state.populations.values()) {
    for (const group of population.groups) {
      if (group.workplace) {
        workers += group.size
      }
    }
  }
  
  return workers
}

export const selectAverageWage = (state: GameState): number => {
  let totalWage = 0
  let totalPopulation = 0
  
  for (const population of state.populations.values()) {
    totalWage += population.averageWage * population.totalPopulation
    totalPopulation += population.totalPopulation
  }
  
  if (totalPopulation === 0) return 0
  return totalWage / totalPopulation
}

export const selectAverageLivingStandard = (state: GameState): number => {
  let totalStandard = 0
  let totalPopulation = 0
  
  for (const population of state.populations.values()) {
    totalStandard += population.averageLivingStandard * population.totalPopulation
    totalPopulation += population.totalPopulation
  }
  
  if (totalPopulation === 0) return 0
  return totalStandard / totalPopulation
}

export const selectTotalMoney = (state: GameState): number => {
  return state.resources.money
}

export const selectGoodsCount = (state: GameState, goodsId: string): number => {
  return state.resources.goods.get(goodsId) || 0
}

export const selectAllGoods = (state: GameState): Map<string, number> => {
  return new Map(state.resources.goods)
}

export const selectMarketPrice = (state: GameState, marketId: string, goodsId: string): number => {
  const market = state.markets.get(marketId)
  if (!market) return 0
  
  const priceData = market.prices.get(goodsId)
  return priceData?.currentPrice || 0
}

export const selectMarketSupply = (state: GameState, marketId: string, goodsId: string): number => {
  const market = state.markets.get(marketId)
  if (!market) return 0
  
  return market.supply.get(goodsId) || 0
}

export const selectMarketDemand = (state: GameState, marketId: string, goodsId: string): number => {
  const market = state.markets.get(marketId)
  if (!market) return 0
  
  return market.demand.get(goodsId) || 0
}

export const selectResearchedTechs = (state: GameState): string[] => {
  return Array.from(state.technologies)
}

export const selectIsTechResearched = (state: GameState, techId: string): boolean => {
  return state.technologies.has(techId)
}

export const selectResearchProgress = (state: GameState): { current: string | null, queue: string[], progress: number } => {
  return {
    current: state.researchQueue.current?.tech || null,
    queue: state.researchQueue.queue,
    progress: state.researchQueue.current?.progress || 0
  }
}

export const selectTotalPopulationByAge = (state: GameState): { children: number, adults: number, elders: number } => {
  const result = { children: 0, adults: 0, elders: 0 }
  
  for (const population of state.populations.values()) {
    result.children += population.ageDistribution.children
    result.adults += population.ageDistribution.adults
    result.elders += population.ageDistribution.elders
  }
  
  return result
}

export const selectPopulationBySocialClass = (state: GameState): Record<string, number> => {
  const result: Record<string, number> = {
    elite: 0,
    middle: 0,
    worker: 0,
    poor: 0
  }
  
  for (const population of state.populations.values()) {
    for (const [className, count] of Object.entries(population.classDistribution)) {
      result[className] += count
    }
  }
  
  return result
}

export const selectNotificationsByType = (state: GameState, type: 'info' | 'warning' | 'error' | 'success'): number => {
  return state.notifications.filter(n => n.type === type).length
}

export const selectRecentNotifications = (state: GameState, limit: number = 10) => {
  return state.notifications
    .slice(-limit)
    .reverse()
}

export const selectBuildingEfficiency = (state: GameState, buildingId: string): number => {
  const building = state.buildings.get(buildingId)
  if (!building) return 0
  
  const workers = selectBuildingWorkers(state, buildingId)
  if (workers === 0) return 0
  
  const efficiency = Math.min(1, workers / building.baseWorkers)
  return efficiency * building.level
}

export const selectProductionCapacity = (state: GameState): Map<string, number> => {
  const capacity = new Map<string, number>()
  
  for (const [id, building] of state.buildings) {
    const efficiency = selectBuildingEfficiency(state, id)
    const output = building.baseThroughput * efficiency
    capacity.set(id, output)
  }
  
  return capacity
}

export const selectGameProgress = (state: GameState): { era: string, year: number, totalDays: number } => {
  const totalDays = state.date.year * 365 + state.date.month * 30 + state.date.day
  
  return {
    era: state.era,
    year: state.date.year,
    totalDays
  }
}
