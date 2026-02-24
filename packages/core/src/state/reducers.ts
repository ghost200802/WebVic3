import { GameState } from '../models/gameState'
import { GameAction, ActionTypes } from './actions'
import { BUILDING_CONFIGS } from '../models/building'

export const rootReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case ActionTypes.TICK_TIME:
      return tickTimeReducer(state, action)
    case ActionTypes.SET_PAUSE:
    case ActionTypes.SET_RESUME:
      return pauseReducer(state, action)
    case ActionTypes.SET_TIME_MULTIPLIER:
      return timeMultiplierReducer(state, action)
    case ActionTypes.CREATE_BUILDING:
      return createBuildingReducer(state, action)
    case ActionTypes.UPGRADE_BUILDING:
      return upgradeBuildingReducer(state, action)
    case ActionTypes.REMOVE_BUILDING:
      return removeBuildingReducer(state, action)
    case ActionTypes.SET_PRODUCTION_METHOD:
      return setProductionMethodReducer(state, action)
    case ActionTypes.SET_WORKERS:
      return setWorkersReducer(state, action)
    case ActionTypes.ASSIGN_WORKER:
      return assignWorkerReducer(state, action)
    case ActionTypes.REMOVE_WORKER:
      return removeWorkerReducer(state, action)
    case ActionTypes.UPDATE_POPULATION:
      return updatePopulationReducer(state, action)
    case ActionTypes.ADD_SUPPLY:
      return addSupplyReducer(state, action)
    case ActionTypes.ADD_DEMAND:
      return addDemandReducer(state, action)
    case ActionTypes.EXECUTE_TRANSACTION:
      return executeTransactionReducer(state, action)
    case ActionTypes.ADD_TECH_TO_QUEUE:
      return addTechToQueueReducer(state, action)
    case ActionTypes.REMOVE_TECH_FROM_QUEUE:
      return removeTechFromQueueReducer(state, action)
    case ActionTypes.UNLOCK_TECH:
      return unlockTechReducer(state, action)
    case ActionTypes.ADD_NOTIFICATION:
      return addNotificationReducer(state, action)
    case ActionTypes.REMOVE_NOTIFICATION:
      return removeNotificationReducer(state, action)
    case ActionTypes.SET_RESOURCE_MONEY:
      return setResourceMoneyReducer(state, action)
    case ActionTypes.SET_GOODS_QUANTITY:
      return setGoodsQuantityReducer(state, action)
    case ActionTypes.ADD_POPULATION:
      return addPopulationReducer(state, action)
    default:
      return state
  }
}

const tickTimeReducer = (state: GameState, action: GameAction): GameState => {
  const { days } = action.payload || {}
  
  let newDate = { ...state.date }
  const totalDays = state.date.year * 365 + (state.date.month - 1) * 30 + state.date.day + days
  
  const newYear = Math.floor(totalDays / 365)
  const remainingDays = totalDays % 365
  const newMonth = Math.floor((remainingDays - 1) / 30) + 1
  const newDay = ((remainingDays - 1) % 30) + 1
  
  newDate = {
    year: newYear,
    month: newMonth,
    day: newDay
  }
  
  return {
    ...state,
    date: newDate,
    tickCount: state.tickCount + 1
  }
}

const pauseReducer = (state: GameState, action: GameAction): GameState => {
  const { isPaused } = action.payload || {}
  return {
    ...state,
    isPaused: isPaused !== undefined ? isPaused : action.type === ActionTypes.SET_PAUSE
  }
}

const timeMultiplierReducer = (state: GameState, action: GameAction): GameState => {
  const { multiplier } = action.payload || {}
  return {
    ...state,
    timeMultiplier: multiplier || 1
  }
}

const createBuildingReducer = (state: GameState, action: GameAction): GameState => {
  const { id, type, tileId } = action.payload || {}
  
  const config = Object.values(BUILDING_CONFIGS).find(c => c.type === type)
  if (!config) return state
  
  const newBuilding = {
    id,
    name: config.name,
    type,
    minEra: config.minEra,
    constructionCost: { ...config.constructionCost },
    constructionTime: config.constructionTime,
    baseWorkers: config.baseWorkers,
    maxWorkers: config.maxWorkers,
    currentWorkers: 0,
    baseThroughput: config.baseThroughput,
    productionMethods: [...config.productionMethods],
    level: 1,
    experience: 0,
    tileId
  }
  
  return {
    ...state,
    buildings: new Map(state.buildings).set(id, newBuilding)
  }
}

const upgradeBuildingReducer = (state: GameState, action: GameAction): GameState => {
  const { buildingId, level } = action.payload || {}
  const building = state.buildings.get(buildingId)
  
  if (!building) return state
  
  return {
    ...state,
    buildings: new Map(state.buildings).set(buildingId, {
      ...building,
      level: level || building.level + 1
    })
  }
}

const removeBuildingReducer = (state: GameState, action: GameAction): GameState => {
  const { buildingId } = action.payload || {}
  const newBuildings = new Map(state.buildings)
  newBuildings.delete(buildingId)
  
  return {
    ...state,
    buildings: newBuildings
  }
}

const setProductionMethodReducer = (state: GameState, action: GameAction): GameState => {
  const { buildingId, methodId } = action.payload || {}
  const building = state.buildings.get(buildingId)
  
  if (!building) return state
  if (!building.productionMethods.includes(methodId)) return state
  
  return {
    ...state,
    buildings: new Map(state.buildings).set(buildingId, {
      ...building,
      productionMethods: [methodId]
    })
  }
}

const setWorkersReducer = (state: GameState, action: GameAction): GameState => {
  const { buildingId, workers } = action.payload || {}
  const building = state.buildings.get(buildingId)
  
  if (!building) return state
  
  return {
    ...state,
    buildings: new Map(state.buildings).set(buildingId, {
      ...building,
      currentWorkers: Math.max(0, Math.min(workers, building.maxWorkers))
    })
  }
}

const assignWorkerReducer = (state: GameState, action: GameAction): GameState => {
  const { populationId, buildingId, groupId } = action.payload || {}
  const population = state.populations.get(populationId)
  
  if (!population) return state
  
  const group = population.groups.find(g => g.id === groupId)
  if (!group) return state
  
  return {
    ...state,
    populations: new Map(state.populations).set(populationId, {
      ...population,
      groups: population.groups.map(g =>
        g.id === groupId ? { ...g, workplace: buildingId } : g
      )
    })
  }
}

const removeWorkerReducer = (state: GameState, action: GameAction): GameState => {
  const { populationId, buildingId, groupId } = action.payload || {}
  const population = state.populations.get(populationId)
  
  if (!population) return state
  
  return {
    ...state,
    populations: new Map(state.populations).set(populationId, {
      ...population,
      groups: population.groups.map(g =>
        g.id === groupId && g.workplace === buildingId ? { ...g, workplace: undefined } : g
      )
    })
  }
}

const updatePopulationReducer = (state: GameState, action: GameAction): GameState => {
  const { populationId, updates } = action.payload || {}
  const population = state.populations.get(populationId)
  
  if (!population) return state
  
  return {
    ...state,
    populations: new Map(state.populations).set(populationId, {
      ...population,
      ...updates
    })
  }
}

const addSupplyReducer = (state: GameState, action: GameAction): GameState => {
  const { marketId, goodsId, amount } = action.payload || {}
  const market = state.markets.get(marketId)
  
  if (!market) return state
  
  const newSupply = new Map(market.supply)
  newSupply.set(goodsId, (newSupply.get(goodsId) || 0) + amount)
  
  return {
    ...state,
    markets: new Map(state.markets).set(marketId, {
      ...market,
      supply: newSupply
    })
  }
}

const addDemandReducer = (state: GameState, action: GameAction): GameState => {
  const { marketId, goodsId, amount } = action.payload || {}
  const market = state.markets.get(marketId)
  
  if (!market) return state
  
  const newDemand = new Map(market.demand)
  newDemand.set(goodsId, (newDemand.get(goodsId) || 0) + amount)
  
  return {
    ...state,
    markets: new Map(state.markets).set(marketId, {
      ...market,
      demand: newDemand
    })
  }
}

const executeTransactionReducer = (state: GameState, action: GameAction): GameState => {
  const { marketId, goodsId, amount, price } = action.payload || {}
  const market = state.markets.get(marketId)
  
  if (!market) return state
  
  const newSupply = new Map(market.supply)
  const newDemand = new Map(market.demand)
  
  newSupply.set(goodsId, Math.max(0, (newSupply.get(goodsId) || 0) - amount))
  newDemand.set(goodsId, Math.max(0, (newDemand.get(goodsId) || 0) - amount))
  
  const priceData = market.prices.get(goodsId)
  const newPrices = new Map(market.prices)
  
  if (priceData) {
    newPrices.set(goodsId, {
      ...priceData,
      previousPrice: priceData.currentPrice,
      currentPrice: price
    })
  }
  
  return {
    ...state,
    markets: new Map(state.markets).set(marketId, {
      ...market,
      supply: newSupply,
      demand: newDemand,
      prices: newPrices
    })
  }
}

const addTechToQueueReducer = (state: GameState, action: GameAction): GameState => {
  const { techId } = action.payload || {}
  
  if (state.technologies.has(techId)) return state
  if (state.researchQueue.queue.includes(techId)) return state
  if (state.researchQueue.current?.tech === techId) return state
  
  return {
    ...state,
    researchQueue: {
      ...state.researchQueue,
      queue: [...state.researchQueue.queue, techId]
    }
  }
}

const removeTechFromQueueReducer = (state: GameState, action: GameAction): GameState => {
  const { techId } = action.payload || {}
  
  return {
    ...state,
    researchQueue: {
      ...state.researchQueue,
      queue: state.researchQueue.queue.filter(id => id !== techId)
    }
  }
}

const unlockTechReducer = (state: GameState, action: GameAction): GameState => {
  const { techId } = action.payload || {}
  
  if (state.technologies.has(techId)) return state
  
  const newTechnologies = new Set(state.technologies)
  newTechnologies.add(techId)
  
  return {
    ...state,
    technologies: newTechnologies,
    researchQueue: {
      ...state.researchQueue,
      queue: state.researchQueue.queue.filter(id => id !== techId),
      current: state.researchQueue.current?.tech === techId ? null : state.researchQueue.current
    }
  }
}

const addNotificationReducer = (state: GameState, action: GameAction): GameState => {
  const notification = action.payload || {}
  
  return {
    ...state,
    notifications: [...state.notifications, notification]
  }
}

const removeNotificationReducer = (state: GameState, action: GameAction): GameState => {
  const { id } = action.payload || {}
  
  return {
    ...state,
    notifications: state.notifications.filter(n => n.id !== id)
  }
}

const setResourceMoneyReducer = (state: GameState, action: GameAction): GameState => {
  const { amount } = action.payload || {}
  
  return {
    ...state,
    resources: {
      ...state.resources,
      money: amount
    }
  }
}

const setGoodsQuantityReducer = (state: GameState, action: GameAction): GameState => {
  const { goodsId, amount } = action.payload || {}
  
  return {
    ...state,
    resources: {
      ...state.resources,
      goods: new Map(state.resources.goods).set(goodsId, amount)
    }
  }
}

const addPopulationReducer = (state: GameState, action: GameAction): GameState => {
  const payload = action.payload || {}
  
  return {
    ...state,
    populations: new Map(state.populations).set(payload.populationId, {
      id: payload.populationId,
      tileId: payload.tileId,
      totalPopulation: payload.totalPopulation,
      groups: payload.groups,
      ageDistribution: payload.ageDistribution,
      educationDistribution: payload.educationDistribution,
      classDistribution: payload.classDistribution,
      employment: payload.employment,
      averageWage: payload.averageWage,
      averageLivingStandard: payload.averageLivingStandard,
      birthRate: payload.birthRate,
      deathRate: payload.deathRate,
      netMigration: payload.netMigration
    })
  }
}

export const batchActions = (state: GameState, actions: GameAction[]): GameState => {
  return actions.reduce((currentState, action) => rootReducer(currentState, action), state)
}
