import { TerrainType } from './baseTypes'

export interface Tile {
  id: string
  name: string
  terrainComposition: Map<TerrainType, number>
  totalArea: number
  buildableArea: number
  usedArea: number
  resources: ResourceDeposit[]
  buildings: string[]
  storage: Map<string, number>
  isExplored: boolean
  isControlled: boolean
  controlCost: number
  roadLevel: number
  transportHub?: string
  developmentLevel: number
  developmentExperience: number
}

export interface ResourceDeposit {
  id: string
  type: string
  totalAmount: number
  currentAmount: number
  extractionDifficulty: number
  richness: DepositRichness
  requiredTech: string[]
  requiredBuilding: string
  isDiscovered: boolean
  isActive: boolean
}

export enum DepositRichness {
  TRACE = 'trace',
  POOR = 'poor',
  NORMAL = 'normal',
  RICH = 'rich',
  VERY_RICH = 'very_rich'
}

export interface TileDevelopment {
  level: number
  experience: number
  experienceToNext: number
  bonuses: {
    productionEfficiency: number
    populationCapacity: number
    buildingSlots: number
    taxIncome: number
  }
}

export interface TerrainConfig {
  type: TerrainType
  name: string
  buildableRatio: number
  constructionCostModifier: number
  baseAgricultureYield: number
  baseMiningYield: number
  baseForestryYield: number
  populationEfficiency: number
  populationGrowth: number
}

export const TERRAIN_CONFIGS: Record<TerrainType, TerrainConfig> = {
  [TerrainType.PLAINS]: {
    type: TerrainType.PLAINS,
    name: '平原',
    buildableRatio: 1.0,
    constructionCostModifier: 1.0,
    baseAgricultureYield: 1.0,
    baseMiningYield: 0.3,
    baseForestryYield: 0.5,
    populationEfficiency: 1.0,
    populationGrowth: 1.0
  },
  [TerrainType.FOREST]: {
    type: TerrainType.FOREST,
    name: '森林',
    buildableRatio: 0.6,
    constructionCostModifier: 1.2,
    baseAgricultureYield: 0.6,
    baseMiningYield: 0.4,
    baseForestryYield: 1.2,
    populationEfficiency: 0.9,
    populationGrowth: 0.95
  },
  [TerrainType.HILLS]: {
    type: TerrainType.HILLS,
    name: '丘陵',
    buildableRatio: 0.7,
    constructionCostModifier: 1.3,
    baseAgricultureYield: 0.7,
    baseMiningYield: 1.0,
    baseForestryYield: 0.8,
    populationEfficiency: 0.85,
    populationGrowth: 0.9
  },
  [TerrainType.WATER]: {
    type: TerrainType.WATER,
    name: '水域',
    buildableRatio: 0.2,
    constructionCostModifier: 2.0,
    baseAgricultureYield: 0.5,
    baseMiningYield: 0.0,
    baseForestryYield: 0.0,
    populationEfficiency: 0.8,
    populationGrowth: 0.8
  },
  [TerrainType.DESERT]: {
    type: TerrainType.DESERT,
    name: '沙漠',
    buildableRatio: 0.3,
    constructionCostModifier: 1.5,
    baseAgricultureYield: 0.2,
    baseMiningYield: 0.6,
    baseForestryYield: 0.0,
    populationEfficiency: 0.7,
    populationGrowth: 0.7
  },
  [TerrainType.SNOW]: {
    type: TerrainType.SNOW,
    name: '冰雪',
    buildableRatio: 0.25,
    constructionCostModifier: 1.8,
    baseAgricultureYield: 0.1,
    baseMiningYield: 0.8,
    baseForestryYield: 0.0,
    populationEfficiency: 0.6,
    populationGrowth: 0.6
  },
  [TerrainType.SWAMP]: {
    type: TerrainType.SWAMP,
    name: '沼泽',
    buildableRatio: 0.4,
    constructionCostModifier: 1.6,
    baseAgricultureYield: 0.4,
    baseMiningYield: 0.3,
    baseForestryYield: 0.6,
    populationEfficiency: 0.75,
    populationGrowth: 0.8
  },
  [TerrainType.MOUNTAIN]: {
    type: TerrainType.MOUNTAIN,
    name: '山地',
    buildableRatio: 0.4,
    constructionCostModifier: 1.7,
    baseAgricultureYield: 0.3,
    baseMiningYield: 1.2,
    baseForestryYield: 0.4,
    populationEfficiency: 0.7,
    populationGrowth: 0.7
  }
}
