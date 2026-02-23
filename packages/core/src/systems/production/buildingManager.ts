import { Building, BUILDING_CONFIGS } from '../../models'

export interface ProductionResult {
  inputs: Map<string, number>
  outputs: Map<string, number>
  efficiency: number
}

export interface IBuildingManager {
  createBuilding(configKey: string, tileId: string): Building
  getBuilding(id: string): Building | undefined
  getAllBuildings(): Building[]
  getBuildingsByTile(tileId: string): Building[]
  upgradeBuilding(buildingId: string): void
  removeBuilding(buildingId: string): void
  setProductionMethod(buildingId: string, methodId: string): void
}

export class BuildingManager implements IBuildingManager {
  private buildings: Map<string, Building>
  private nextId: number

  constructor() {
    this.buildings = new Map()
    this.nextId = 1
  }

  createBuilding(configKey: string, tileId: string): Building {
    const config = BUILDING_CONFIGS[configKey]
    if (!config) {
      throw new Error(`Building config not found: ${configKey}`)
    }

    const building: Building = {
      id: `building_${this.nextId++}`,
      name: config.name,
      type: config.type,
      minEra: config.minEra,
      constructionCost: { ...config.constructionCost },
      constructionTime: config.constructionTime,
      baseWorkers: config.baseWorkers,
      maxWorkers: config.maxWorkers,
      baseThroughput: config.baseThroughput,
      productionMethods: [...config.productionMethods],
      level: 1,
      experience: 0,
      tileId
    }

    this.buildings.set(building.id, building)
    return building
  }

  getBuilding(id: string): Building | undefined {
    return this.buildings.get(id)
  }

  getAllBuildings(): Building[] {
    return Array.from(this.buildings.values())
  }

  getBuildingsByTile(tileId: string): Building[] {
    return Array.from(this.buildings.values()).filter(b => b.tileId === tileId)
  }

  upgradeBuilding(buildingId: string): void {
    const building = this.buildings.get(buildingId)
    if (!building) {
      throw new Error(`Building not found: ${buildingId}`)
    }

    building.level += 1
    building.experience = 0
  }

  removeBuilding(buildingId: string): void {
    this.buildings.delete(buildingId)
  }

  setProductionMethod(buildingId: string, methodId: string): void {
    const building = this.buildings.get(buildingId)
    if (!building) {
      throw new Error(`Building not found: ${buildingId}`)
    }

    if (!building.productionMethods.includes(methodId)) {
      throw new Error(`Production method not available: ${methodId}`)
    }

    building.productionMethods = [methodId]
  }
}
