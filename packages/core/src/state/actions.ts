import { BuildingType } from '../models/baseTypes'

export interface GameAction {
  type: string
  payload?: any
  timestamp: number
}

export interface TimeTickPayload {
  days: number
}

export interface SetPausePayload {
  isPaused: boolean
}

export interface SetTimeMultiplierPayload {
  multiplier: number
}

export interface CreateBuildingPayload {
  id: string
  type: BuildingType
  tileId: string
}

export interface UpgradeBuildingPayload {
  buildingId: string
  level: number
}

export interface RemoveBuildingPayload {
  buildingId: string
}

export interface SetProductionMethodPayload {
  buildingId: string
  methodId: string
}

export interface SetWorkersPayload {
  buildingId: string
  workers: number
}

export interface AssignWorkerPayload {
  populationId: string
  buildingId: string
  groupId: string
}

export interface RemoveWorkerPayload {
  populationId: string
  buildingId: string
  groupId: string
}

export interface UpdatePopulationPayload {
  populationId: string
  updates: Partial<{
    totalPopulation: number
    ageDistribution: {
      children: number
      adults: number
      elders: number
    }
    educationDistribution: Record<string, number>
    classDistribution: Record<string, number>
    employment: {
      total: number
      employed: number
      unemployed: number
      retired: number
    }
    averageWage: number
    averageLivingStandard: number
    birthRate: number
    deathRate: number
    netMigration: number
  }>
}

export interface AddSupplyPayload {
  marketId: string
  goodsId: string
  amount: number
}

export interface AddDemandPayload {
  marketId: string
  goodsId: string
  amount: number
}

export interface ExecuteTransactionPayload {
  marketId: string
  goodsId: string
  amount: number
  price: number
}

export interface AddTechToQueuePayload {
  techId: string
}

export interface RemoveTechFromQueuePayload {
  techId: string
}

export interface UnlockTechPayload {
  techId: string
}

export interface NotificationPayload {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: number
}

export interface SetResourceMoneyPayload {
  amount: number
}

export interface SetGoodsQuantityPayload {
  goodsId: string
  amount: number
}

export interface AddPopulationPayload {
  populationId: string
  tileId: string
  totalPopulation: number
  groups: any[]
  ageDistribution: any
  educationDistribution: Record<string, number>
  classDistribution: Record<string, number>
  employment: any
  averageWage: number
  averageLivingStandard: number
  birthRate: number
  deathRate: number
  netMigration: number
}

export interface AddTileStoragePayload {
  tileId: string
  goodsId: string
  amount: number
}

export interface RemoveTileStoragePayload {
  tileId: string
  goodsId: string
  amount: number
}

export interface AddGlobalStoragePayload {
  goodsId: string
  amount: number
}

export interface RemoveGlobalStoragePayload {
  goodsId: string
  amount: number
}

export const ActionTypes = {
  TICK_TIME: 'TICK_TIME',
  SET_PAUSE: 'SET_PAUSE',
  SET_RESUME: 'SET_RESUME',
  SET_TIME_MULTIPLIER: 'SET_TIME_MULTIPLIER',
  CREATE_BUILDING: 'CREATE_BUILDING',
  UPGRADE_BUILDING: 'UPGRADE_BUILDING',
  REMOVE_BUILDING: 'REMOVE_BUILDING',
  SET_PRODUCTION_METHOD: 'SET_PRODUCTION_METHOD',
  SET_WORKERS: 'SET_WORKERS',
  ASSIGN_WORKER: 'ASSIGN_WORKER',
  REMOVE_WORKER: 'REMOVE_WORKER',
  UPDATE_POPULATION: 'UPDATE_POPULATION',
  ADD_SUPPLY: 'ADD_SUPPLY',
  ADD_DEMAND: 'ADD_DEMAND',
  EXECUTE_TRANSACTION: 'EXECUTE_TRANSACTION',
  ADD_TECH_TO_QUEUE: 'ADD_TECH_TO_QUEUE',
  REMOVE_TECH_FROM_QUEUE: 'REMOVE_TECH_FROM_QUEUE',
  UNLOCK_TECH: 'UNLOCK_TECH',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_RESOURCE_MONEY: 'SET_RESOURCE_MONEY',
  SET_GOODS_QUANTITY: 'SET_GOODS_QUANTITY',
  ADD_POPULATION: 'ADD_POPULATION',
  ADD_TILE_STORAGE: 'ADD_TILE_STORAGE',
  REMOVE_TILE_STORAGE: 'REMOVE_TILE_STORAGE',
  ADD_GLOBAL_STORAGE: 'ADD_GLOBAL_STORAGE',
  REMOVE_GLOBAL_STORAGE: 'REMOVE_GLOBAL_STORAGE'
} as const

export type ActionType = typeof ActionTypes[keyof typeof ActionTypes]

export const createGameAction = (type: ActionType, payload?: any): GameAction => ({
  type,
  payload,
  timestamp: Date.now()
})

export const tickTime = (days: number): GameAction =>
  createGameAction(ActionTypes.TICK_TIME, { days } as TimeTickPayload)

export const setPause = (): GameAction =>
  createGameAction(ActionTypes.SET_PAUSE, { isPaused: true } as SetPausePayload)

export const setResume = (): GameAction =>
  createGameAction(ActionTypes.SET_RESUME, { isPaused: false } as SetPausePayload)

export const setTimeMultiplier = (multiplier: number): GameAction =>
  createGameAction(ActionTypes.SET_TIME_MULTIPLIER, { multiplier } as SetTimeMultiplierPayload)

export const createBuilding = (id: string, type: BuildingType, tileId: string): GameAction =>
  createGameAction(ActionTypes.CREATE_BUILDING, { id, type, tileId } as CreateBuildingPayload)

export const upgradeBuilding = (buildingId: string, level: number): GameAction =>
  createGameAction(ActionTypes.UPGRADE_BUILDING, { buildingId, level } as UpgradeBuildingPayload)

export const removeBuilding = (buildingId: string): GameAction =>
  createGameAction(ActionTypes.REMOVE_BUILDING, { buildingId } as RemoveBuildingPayload)

export const setProductionMethod = (buildingId: string, methodId: string): GameAction =>
  createGameAction(ActionTypes.SET_PRODUCTION_METHOD, { buildingId, methodId } as SetProductionMethodPayload)

export const setWorkers = (buildingId: string, workers: number): GameAction =>
  createGameAction(ActionTypes.SET_WORKERS, { buildingId, workers } as SetWorkersPayload)

export const assignWorker = (populationId: string, buildingId: string, groupId: string): GameAction =>
  createGameAction(ActionTypes.ASSIGN_WORKER, { populationId, buildingId, groupId } as AssignWorkerPayload)

export const removeWorker = (populationId: string, buildingId: string, groupId: string): GameAction =>
  createGameAction(ActionTypes.REMOVE_WORKER, { populationId, buildingId, groupId } as RemoveWorkerPayload)

export const updatePopulation = (populationId: string, updates: any): GameAction =>
  createGameAction(ActionTypes.UPDATE_POPULATION, { populationId, updates } as UpdatePopulationPayload)

export const addSupply = (marketId: string, goodsId: string, amount: number): GameAction =>
  createGameAction(ActionTypes.ADD_SUPPLY, { marketId, goodsId, amount } as AddSupplyPayload)

export const addDemand = (marketId: string, goodsId: string, amount: number): GameAction =>
  createGameAction(ActionTypes.ADD_DEMAND, { marketId, goodsId, amount } as AddDemandPayload)

export const executeTransaction = (marketId: string, goodsId: string, amount: number, price: number): GameAction =>
  createGameAction(ActionTypes.EXECUTE_TRANSACTION, { marketId, goodsId, amount, price } as ExecuteTransactionPayload)

export const addTechToQueue = (techId: string): GameAction =>
  createGameAction(ActionTypes.ADD_TECH_TO_QUEUE, { techId } as AddTechToQueuePayload)

export const removeTechFromQueue = (techId: string): GameAction =>
  createGameAction(ActionTypes.REMOVE_TECH_FROM_QUEUE, { techId } as RemoveTechFromQueuePayload)

export const unlockTech = (techId: string): GameAction =>
  createGameAction(ActionTypes.UNLOCK_TECH, { techId } as UnlockTechPayload)

export const addNotification = (id: string, type: 'info' | 'warning' | 'error' | 'success', title: string, message: string): GameAction =>
  createGameAction(ActionTypes.ADD_NOTIFICATION, { id, type, title, message, timestamp: Date.now() } as NotificationPayload)

export const removeNotification = (id: string): GameAction =>
  createGameAction(ActionTypes.REMOVE_NOTIFICATION, { id })

export const setResourceMoney = (amount: number): GameAction =>
  createGameAction(ActionTypes.SET_RESOURCE_MONEY, { amount } as SetResourceMoneyPayload)

export const setGoodsQuantity = (goodsId: string, amount: number): GameAction =>
  createGameAction(ActionTypes.SET_GOODS_QUANTITY, { goodsId, amount } as SetGoodsQuantityPayload)

export const addPopulation = (payload: AddPopulationPayload): GameAction =>
  createGameAction(ActionTypes.ADD_POPULATION, payload)

export const addTileStorage = (tileId: string, goodsId: string, amount: number): GameAction =>
  createGameAction(ActionTypes.ADD_TILE_STORAGE, { tileId, goodsId, amount } as AddTileStoragePayload)

export const removeTileStorage = (tileId: string, goodsId: string, amount: number): GameAction =>
  createGameAction(ActionTypes.REMOVE_TILE_STORAGE, { tileId, goodsId, amount } as RemoveTileStoragePayload)

export const addGlobalStorage = (goodsId: string, amount: number): GameAction =>
  createGameAction(ActionTypes.ADD_GLOBAL_STORAGE, { goodsId, amount } as AddGlobalStoragePayload)

export const removeGlobalStorage = (goodsId: string, amount: number): GameAction =>
  createGameAction(ActionTypes.REMOVE_GLOBAL_STORAGE, { goodsId, amount } as RemoveGlobalStoragePayload)
