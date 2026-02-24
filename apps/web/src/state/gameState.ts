import { GameStateProvider, Era, AgeGroup, EducationLevel, SocialClass, BuildingType, TerrainType, EmploymentStatus, type GameState, type PopulationGroup, type Population, type Building, type Tile } from '@webvic3/core'
import { addPopulation as addPopulationAction } from '@webvic3/core'

export interface GameAlert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: number
}

export interface ExtendedBuilding extends Building {
  efficiency: number
  workers: number
  count: number
}

export interface ExtendedPopulation extends Population {
  name: string
  employedPopulation: number
  unemployedPopulation: number
  wage: number
  growthRate: number
  standardOfLiving: string
}

let _provider: GameStateProvider | null = null

export const getGameStateProvider = (): GameStateProvider => {
  if (!_provider) {
    _provider = new GameStateProvider()
  }
  return _provider
}

export const initializeGame = (): void => {
  const provider = getGameStateProvider()

  const tile1: Tile = {
    id: 'tile_1',
    name: '中央平原',
    terrainComposition: new Map([
      [TerrainType.PLAINS, 0.6],
      [TerrainType.FOREST, 0.2],
      [TerrainType.WATER, 0.2]
    ]),
    totalArea: 100,
    buildableArea: 60,
    usedArea: 0,
    resources: [],
    buildings: [],
    storage: new Map(),
    isExplored: true,
    isControlled: true,
    controlCost: 100,
    roadLevel: 1,
    developmentLevel: 0,
    developmentExperience: 0
  }

  const tile2: Tile = {
    id: 'tile_2',
    name: '东部森林',
    terrainComposition: new Map([
      [TerrainType.FOREST, 0.8],
      [TerrainType.PLAINS, 0.2]
    ]),
    totalArea: 100,
    buildableArea: 70,
    usedArea: 0,
    resources: [],
    buildings: [],
    storage: new Map(),
    isExplored: true,
    isControlled: true,
    controlCost: 150,
    roadLevel: 0,
    developmentLevel: 0,
    developmentExperience: 0
  }

  const tile3: Tile = {
    id: 'tile_3',
    name: '南部山地',
    terrainComposition: new Map([
      [TerrainType.MOUNTAIN, 0.7],
      [TerrainType.PLAINS, 0.3]
    ]),
    totalArea: 100,
    buildableArea: 30,
    usedArea: 0,
    resources: [],
    buildings: [],
    storage: new Map(),
    isExplored: true,
    isControlled: true,
    controlCost: 200,
    roadLevel: 0,
    developmentLevel: 0,
    developmentExperience: 0
  }

  const gameState: GameState = {
    id: 'game_1',
    name: '新游戏',
    version: '1.0.0',
    date: { year: 1, month: 1, day: 1 },
    era: Era.STONE_AGE,
    tickCount: 0,
    tiles: new Map([
      ['tile_1', tile1],
      ['tile_2', tile2],
      ['tile_3', tile3]
    ]),
    buildings: new Map(),
    populations: new Map(),
    markets: new Map(),
    technologies: new Set(['stone_tool']),
    researchQueue: {
      current: { tech: 'domestication', progress: 0, estimatedCompletion: { year: 1, month: 2, day: 1 } },
      queue: ['metal_smelting'],
      researchSpeed: 1.0
    },
    resources: {
      money: 1000,
      goods: new Map([
        ['food', 500],
        ['wood', 300],
        ['stone', 200]
      ])
    },
    globalStorage: new Map(),
    settings: {
      gameSpeed: 1,
      autoSaveInterval: 5,
      difficulty: 'normal',
      enabledFeatures: {
        events: true,
        disasters: true,
        wars: false,
        trade: true
      }
    },
    isPaused: false,
    timeMultiplier: 1,
    notifications: []
  }

  provider.initialize(gameState)

  const farmerGroup: PopulationGroup = {
    id: 'group_farmers',
    size: 1200,
    ageGroup: AgeGroup.ADULT,
    education: EducationLevel.BASIC,
    socialClass: SocialClass.WORKER,
    employment: EmploymentStatus.EMPLOYED,
    wage: 8,
    wealth: 100,
    livingStandard: 3,
    needs: { survival: 50, basic: 30, improved: 15, luxury: 5 }
  }

  const workerGroup: PopulationGroup = {
    id: 'group_workers',
    size: 800,
    ageGroup: AgeGroup.ADULT,
    education: EducationLevel.PRIMARY,
    socialClass: SocialClass.WORKER,
    employment: EmploymentStatus.EMPLOYED,
    wage: 12,
    wealth: 150,
    livingStandard: 4,
    needs: { survival: 50, basic: 30, improved: 15, luxury: 5 }
  }

  const merchantGroup: PopulationGroup = {
    id: 'group_merchants',
    size: 200,
    ageGroup: AgeGroup.ADULT,
    education: EducationLevel.SECONDARY,
    socialClass: SocialClass.MIDDLE,
    employment: EmploymentStatus.EMPLOYED,
    wage: 25,
    wealth: 300,
    livingStandard: 5,
    needs: { survival: 50, basic: 30, improved: 15, luxury: 5 }
  }

  const farmerPopulation: ExtendedPopulation = {
    id: 'pop_farmers',
    tileId: 'tile_1',
    totalPopulation: 1200,
    groups: [farmerGroup],
    ageDistribution: { children: 300, adults: 800, elders: 100 },
    educationDistribution: {
      [EducationLevel.ILLITERATE]: 200,
      [EducationLevel.BASIC]: 800,
      [EducationLevel.PRIMARY]: 200,
      [EducationLevel.SECONDARY]: 0,
      [EducationLevel.UNIVERSITY]: 0,
      [EducationLevel.POSTGRADUATE]: 0
    },
    classDistribution: {
      [SocialClass.ELITE]: 0,
      [SocialClass.MIDDLE]: 100,
      [SocialClass.WORKER]: 1000,
      [SocialClass.POOR]: 100
    },
    employment: { total: 1200, employed: 1100, unemployed: 100, retired: 0 },
    averageWage: 8,
    averageLivingStandard: 3,
    birthRate: 0.02,
    deathRate: 0.01,
    netMigration: 0,
    name: '农民',
    employedPopulation: 1100,
    unemployedPopulation: 100,
    wage: 8,
    growthRate: 0.02,
    standardOfLiving: 'medium'
  }

  const workerPopulation: ExtendedPopulation = {
    id: 'pop_workers',
    tileId: 'tile_1',
    totalPopulation: 800,
    groups: [workerGroup],
    ageDistribution: { children: 150, adults: 600, elders: 50 },
    educationDistribution: {
      [EducationLevel.ILLITERATE]: 0,
      [EducationLevel.BASIC]: 200,
      [EducationLevel.PRIMARY]: 500,
      [EducationLevel.SECONDARY]: 100,
      [EducationLevel.UNIVERSITY]: 0,
      [EducationLevel.POSTGRADUATE]: 0
    },
    classDistribution: {
      [SocialClass.ELITE]: 50,
      [SocialClass.MIDDLE]: 200,
      [SocialClass.WORKER]: 500,
      [SocialClass.POOR]: 50
    },
    employment: { total: 800, employed: 750, unemployed: 50, retired: 0 },
    averageWage: 12,
    averageLivingStandard: 4,
    birthRate: 0.015,
    deathRate: 0.01,
    netMigration: 0,
    name: '工人',
    employedPopulation: 750,
    unemployedPopulation: 50,
    wage: 12,
    growthRate: 0.015,
    standardOfLiving: 'good'
  }

  const merchantPopulation: ExtendedPopulation = {
    id: 'pop_merchants',
    tileId: 'tile_1',
    totalPopulation: 200,
    groups: [merchantGroup],
    ageDistribution: { children: 30, adults: 160, elders: 10 },
    educationDistribution: {
      [EducationLevel.ILLITERATE]: 0,
      [EducationLevel.BASIC]: 0,
      [EducationLevel.PRIMARY]: 50,
      [EducationLevel.SECONDARY]: 150,
      [EducationLevel.UNIVERSITY]: 0,
      [EducationLevel.POSTGRADUATE]: 0
    },
    classDistribution: {
      [SocialClass.ELITE]: 50,
      [SocialClass.MIDDLE]: 150,
      [SocialClass.WORKER]: 0,
      [SocialClass.POOR]: 0
    },
    employment: { total: 200, employed: 200, unemployed: 0, retired: 0 },
    averageWage: 25,
    averageLivingStandard: 5,
    birthRate: 0.01,
    deathRate: 0.008,
    netMigration: 0,
    name: '商人',
    employedPopulation: 200,
    unemployedPopulation: 0,
    wage: 25,
    growthRate: 0.01,
    standardOfLiving: 'excellent'
  }

  provider.dispatch(addPopulationAction({
    populationId: farmerPopulation.id,
    tileId: farmerPopulation.tileId,
    totalPopulation: farmerPopulation.totalPopulation,
    groups: farmerPopulation.groups,
    ageDistribution: farmerPopulation.ageDistribution,
    educationDistribution: farmerPopulation.educationDistribution,
    classDistribution: farmerPopulation.classDistribution,
    employment: farmerPopulation.employment,
    averageWage: farmerPopulation.averageWage,
    averageLivingStandard: farmerPopulation.averageLivingStandard,
    birthRate: farmerPopulation.birthRate,
    deathRate: farmerPopulation.deathRate,
    netMigration: farmerPopulation.netMigration
  }))
  provider.dispatch(addPopulationAction({
    populationId: workerPopulation.id,
    tileId: workerPopulation.tileId,
    totalPopulation: workerPopulation.totalPopulation,
    groups: workerPopulation.groups,
    ageDistribution: workerPopulation.ageDistribution,
    educationDistribution: workerPopulation.educationDistribution,
    classDistribution: workerPopulation.classDistribution,
    employment: workerPopulation.employment,
    averageWage: workerPopulation.averageWage,
    averageLivingStandard: workerPopulation.averageLivingStandard,
    birthRate: workerPopulation.birthRate,
    deathRate: workerPopulation.deathRate,
    netMigration: workerPopulation.netMigration
  }))
  provider.dispatch(addPopulationAction({
    populationId: merchantPopulation.id,
    tileId: merchantPopulation.tileId,
    totalPopulation: merchantPopulation.totalPopulation,
    groups: merchantPopulation.groups,
    ageDistribution: merchantPopulation.ageDistribution,
    educationDistribution: merchantPopulation.educationDistribution,
    classDistribution: merchantPopulation.classDistribution,
    employment: merchantPopulation.employment,
    averageWage: merchantPopulation.averageWage,
    averageLivingStandard: merchantPopulation.averageLivingStandard,
    birthRate: merchantPopulation.birthRate,
    deathRate: merchantPopulation.deathRate,
    netMigration: merchantPopulation.netMigration
  }))
}

export const getBuildingName = (type: BuildingType): string => {
  const names: Record<string, string> = {
    [BuildingType.FARM]: '农场',
    [BuildingType.RANCH]: '牧场',
    [BuildingType.FORESTRY]: '林场',
    [BuildingType.FISHERY]: '渔场',
    [BuildingType.QUARRY]: '矿场',
    [BuildingType.MINE]: '矿场',
    [BuildingType.WORKSHOP]: '工坊',
    [BuildingType.FACTORY]: '工厂'
  }
  return names[type] || type
}

export const getExtendedBuildings = (state: GameState): ExtendedBuilding[] => {
  const buildings: ExtendedBuilding[] = []
  const buildingCounts = new Map<BuildingType, { count: number; workers: number; totalBaseWorkers: number; totalMaxWorkers: number; totalBaseThroughput: number }>()

  for (const [_, building] of state.buildings) {
    const existing = buildingCounts.get(building.type)
    if (existing) {
      existing.count++
      existing.workers += building.currentWorkers
      existing.totalBaseWorkers += building.baseWorkers
      existing.totalMaxWorkers += building.maxWorkers
      existing.totalBaseThroughput += building.baseThroughput
    } else {
      buildingCounts.set(building.type, { 
        count: 1, 
        workers: building.currentWorkers,
        totalBaseWorkers: building.baseWorkers,
        totalMaxWorkers: building.maxWorkers,
        totalBaseThroughput: building.baseThroughput
      })
    }
  }

  for (const [type, data] of buildingCounts) {
    const sampleBuilding = Array.from(state.buildings.values()).find(b => b.type === type)
    if (sampleBuilding) {
      buildings.push({
        ...sampleBuilding,
        baseWorkers: data.totalBaseWorkers,
        maxWorkers: data.totalMaxWorkers,
        baseThroughput: data.totalBaseThroughput,
        efficiency: 1.0,
        workers: data.workers,
        count: data.count
      })
    }
  }

  return buildings
}

export const getExtendedPopulations = (state: GameState): ExtendedPopulation[] => {
  const populations: ExtendedPopulation[] = []

  for (const [_, population] of state.populations) {
    populations.push({
      ...population,
      name: population.id.replace('pop_', ''),
      employedPopulation: population.employment.employed,
      unemployedPopulation: population.employment.unemployed,
      wage: population.averageWage,
      growthRate: population.birthRate - population.deathRate,
      standardOfLiving: population.averageLivingStandard >= 5 ? 'excellent' : 
                     population.averageLivingStandard >= 4 ? 'good' :
                     population.averageLivingStandard >= 3 ? 'medium' : 'poor'
    })
  }

  return populations
}
