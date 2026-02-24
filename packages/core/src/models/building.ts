import { BuildingType, Era } from './baseTypes'

export interface Building {
  id: string
  name: string
  type: BuildingType
  minEra: Era
  maxEra?: Era
  constructionCost: Record<string, number>
  constructionTime: number
  baseWorkers: number
  maxWorkers: number
  currentWorkers: number
  baseThroughput: number
  productionMethods: string[]
  level: number
  experience: number
  tileId: string
}

export interface BuildingConfig {
  id: string
  name: string
  type: BuildingType
  minEra: Era
  baseWorkers: number
  maxWorkers: number
  baseThroughput: number
  constructionCost: Record<string, number>
  constructionTime: number
  productionMethods: string[]
}

export const BUILDING_CONFIGS: Record<string, BuildingConfig> = {
  farm: {
    id: 'farm',
    name: '农田',
    type: BuildingType.FARM,
    minEra: Era.STONE_AGE,
    baseWorkers: 10,
    maxWorkers: 20,
    baseThroughput: 100,
    constructionCost: { wood: 10, stone: 5 },
    constructionTime: 30,
    productionMethods: ['slash_burn', 'plowing', 'mechanized', 'modern']
  },
  ranch: {
    id: 'ranch',
    name: '牧场',
    type: BuildingType.RANCH,
    minEra: Era.STONE_AGE,
    baseWorkers: 8,
    maxWorkers: 15,
    baseThroughput: 50,
    constructionCost: { wood: 15 },
    constructionTime: 25,
    productionMethods: []
  },
  forestry: {
    id: 'forestry',
    name: '林场',
    type: BuildingType.FORESTRY,
    minEra: Era.STONE_AGE,
    baseWorkers: 10,
    maxWorkers: 20,
    baseThroughput: 80,
    constructionCost: { wood: 5 },
    constructionTime: 20,
    productionMethods: []
  },
  fishery: {
    id: 'fishery',
    name: '渔场',
    type: BuildingType.FISHERY,
    minEra: Era.STONE_AGE,
    baseWorkers: 5,
    maxWorkers: 10,
    baseThroughput: 40,
    constructionCost: { wood: 8 },
    constructionTime: 15,
    productionMethods: []
  },
  quarry: {
    id: 'quarry',
    name: '采石场',
    type: BuildingType.QUARRY,
    minEra: Era.STONE_AGE,
    baseWorkers: 12,
    maxWorkers: 20,
    baseThroughput: 60,
    constructionCost: { wood: 10 },
    constructionTime: 35,
    productionMethods: []
  },
  mine: {
    id: 'mine',
    name: '矿场',
    type: BuildingType.MINE,
    minEra: Era.BRONZE_AGE,
    baseWorkers: 15,
    maxWorkers: 25,
    baseThroughput: 80,
    constructionCost: { wood: 20, stone: 15 },
    constructionTime: 50,
    productionMethods: []
  },
  workshop: {
    id: 'workshop',
    name: '作坊',
    type: BuildingType.WORKSHOP,
    minEra: Era.BRONZE_AGE,
    baseWorkers: 8,
    maxWorkers: 15,
    baseThroughput: 50,
    constructionCost: { wood: 30, stone: 20 },
    constructionTime: 40,
    productionMethods: ['handcraft']
  },
  factory: {
    id: 'factory',
    name: '工厂',
    type: BuildingType.FACTORY,
    minEra: Era.INDUSTRIAL,
    baseWorkers: 50,
    maxWorkers: 100,
    baseThroughput: 200,
    constructionCost: { steel: 100, coal: 50 },
    constructionTime: 100,
    productionMethods: ['steam_power', 'assembly_line', 'automation']
  },
  modern_factory: {
    id: 'modern_factory',
    name: '现代工厂',
    type: BuildingType.MODERN_FACTORY,
    minEra: Era.ELECTRICAL,
    baseWorkers: 30,
    maxWorkers: 60,
    baseThroughput: 300,
    constructionCost: { steel: 150, oil: 50 },
    constructionTime: 120,
    productionMethods: ['smart']
  },
  warehouse: {
    id: 'warehouse',
    name: '仓库',
    type: BuildingType.WAREHOUSE,
    minEra: Era.STONE_AGE,
    baseWorkers: 2,
    maxWorkers: 5,
    baseThroughput: 0,
    constructionCost: { wood: 25, stone: 10 },
    constructionTime: 20,
    productionMethods: []
  }
}
