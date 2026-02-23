import { Tile, ResourceDeposit, DepositRichness, TerrainConfig, TERRAIN_CONFIGS, TerrainType } from '../../models'

export interface ITileManager {
  createTile(id: string, name: string, terrainComposition: Map<TerrainType, number>): Tile
  getTile(id: string): Tile | undefined
  getAllTiles(): Tile[]
  addBuildingToTile(tileId: string, buildingId: string): void
  removeBuildingFromTile(tileId: string, buildingId: string): void
  discoverResource(tileId: string, resourceType: string): ResourceDeposit | undefined
  upgradeTransport(tileId: string, level: number): void
  calculateDevelopmentExperience(tileId: string, activity: number): void
}

export class TileManager implements ITileManager {
  private tiles: Map<string, Tile>
  private readonly BASE_EXPERIENCE = 100

  constructor() {
    this.tiles = new Map()
  }

  createTile(id: string, name: string, terrainComposition: Map<TerrainType, number>): Tile {
    const terrainConfigs = Array.from(terrainComposition.entries()).map(([type, ratio]) => ({
      config: TERRAIN_CONFIGS[type],
      ratio
    }))

    const totalArea = 100
    const buildableArea = terrainConfigs.reduce((sum, { config, ratio }) => {
      return sum + totalArea * ratio * config.buildableRatio
    }, 0)

    const tile: Tile = {
      id,
      name,
      terrainComposition,
      totalArea,
      buildableArea,
      usedArea: 0,
      resources: [],
      buildings: [],
      isExplored: false,
      isControlled: false,
      controlCost: this.calculateControlCost(terrainConfigs),
      roadLevel: 0,
      transportHub: undefined,
      developmentLevel: 0,
      developmentExperience: 0
    }

    this.tiles.set(id, tile)
    return tile
  }

  getTile(id: string): Tile | undefined {
    return this.tiles.get(id)
  }

  getAllTiles(): Tile[] {
    return Array.from(this.tiles.values())
  }

  addBuildingToTile(tileId: string, buildingId: string): void {
    const tile = this.tiles.get(tileId)
    if (!tile) {
      throw new Error(`Tile not found: ${tileId}`)
    }

    if (tile.usedArea + 5 > tile.buildableArea) {
      throw new Error(`Tile ${tileId} has no space for new building`)
    }

    tile.buildings.push(buildingId)
    tile.usedArea += 5
  }

  removeBuildingFromTile(tileId: string, buildingId: string): void {
    const tile = this.tiles.get(tileId)
    if (!tile) return

    const index = tile.buildings.indexOf(buildingId)
    if (index !== -1) {
      tile.buildings.splice(index, 1)
      tile.usedArea -= 5
    }
  }

  discoverResource(tileId: string, resourceType: string): ResourceDeposit | undefined {
    const tile = this.tiles.get(tileId)
    if (!tile) return undefined

    const existingResource = tile.resources.find(r => r.type === resourceType)
    if (existingResource) {
      return existingResource
    }

    const deposit: ResourceDeposit = {
      id: `resource_${Date.now()}_${Math.random()}`,
      type: resourceType,
      totalAmount: this.generateResourceAmount(resourceType),
      currentAmount: this.generateResourceAmount(resourceType),
      extractionDifficulty: this.generateExtractionDifficulty(resourceType),
      richness: this.generateRichness(),
      requiredTech: [],
      requiredBuilding: '',
      isDiscovered: true,
      isActive: false
    }

    tile.resources.push(deposit)
    return deposit
  }

  upgradeTransport(tileId: string, level: number): void {
    const tile = this.tiles.get(tileId)
    if (!tile) {
      throw new Error(`Tile not found: ${tileId}`)
    }

    if (level < 0 || level > 3) {
      throw new Error(`Invalid transport level: ${level}`)
    }

    tile.roadLevel = level
  }

  calculateDevelopmentExperience(tileId: string, activity: number): void {
    const tile = this.tiles.get(tileId)
    if (!tile) return

    tile.developmentExperience += activity
    const requiredExperience = this.BASE_EXPERIENCE * (tile.developmentLevel + 1)

    if (tile.developmentExperience >= requiredExperience) {
      tile.developmentLevel += 1
      tile.developmentExperience = 0
      this.applyDevelopmentBonuses(tile)
    }
  }

  private calculateControlCost(terrainConfigs: Array<{ config: TerrainConfig; ratio: number }>): number {
    return terrainConfigs.reduce((sum, { config, ratio }) => {
      return sum + config.constructionCostModifier * ratio * 10
    }, 0)
  }

  private generateResourceAmount(_resourceType: string): number {
    return Math.floor(Math.random() * 9000) + 1000
  }

  private generateExtractionDifficulty(_resourceType: string): number {
    return Math.random() * 0.5 + 0.5
  }

  private generateRichness(): DepositRichness {
    const rand = Math.random()
    if (rand < 0.05) return DepositRichness.VERY_RICH
    if (rand < 0.15) return DepositRichness.RICH
    if (rand < 0.5) return DepositRichness.NORMAL
    if (rand < 0.8) return DepositRichness.POOR
    return DepositRichness.TRACE
  }

  private applyDevelopmentBonuses(tile: Tile): void {
    const bonusPerLevel = 0.05
    tile.buildableArea = tile.totalArea * (1 + tile.developmentLevel * bonusPerLevel)
    tile.developmentExperience = 0
  }
}
