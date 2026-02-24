import { TileManager } from '../index'
import { TerrainType } from '../../../models'

describe('Terrain System', () => {
  let manager: TileManager

  beforeEach(() => {
    manager = new TileManager()
  })

  describe('createTile', () => {
    it('should create tile successfully', () => {
      const terrainComposition = new Map([
        [TerrainType.PLAINS, 0.6],
        [TerrainType.FOREST, 0.4]
      ])
      const tile = manager.createTile('tile_1', 'Test Tile', terrainComposition)
      
      expect(tile).toBeDefined()
      expect(tile.id).toBe('tile_1')
      expect(tile.name).toBe('Test Tile')
      expect(tile.totalArea).toBe(100)
    })

    it('should calculate buildable area', () => {
      const terrainComposition = new Map([
        [TerrainType.PLAINS, 0.6],
        [TerrainType.FOREST, 0.4]
      ])
      const tile = manager.createTile('tile_1', 'Test Tile', terrainComposition)
      
      expect(tile.buildableArea).toBeGreaterThan(0)
      expect(tile.buildableArea).toBeLessThanOrEqual(tile.totalArea)
    })

    it('should calculate control cost', () => {
      const terrainComposition = new Map([
        [TerrainType.MOUNTAIN, 0.5],
        [TerrainType.PLAINS, 0.5]
      ])
      const tile = manager.createTile('tile_1', 'Test Tile', terrainComposition)
      
      expect(tile.controlCost).toBeGreaterThan(0)
    })
  })

  describe('getTile', () => {
    it('should return tile by ID', () => {
      const terrainComposition = new Map([
        [TerrainType.PLAINS, 1.0]
      ])
      const tile = manager.createTile('tile_1', 'Test Tile', terrainComposition)
      const retrieved = manager.getTile('tile_1')
      
      expect(retrieved).toBe(tile)
    })

    it('should return undefined for non-existent tile', () => {
      const retrieved = manager.getTile('non_existent')
      expect(retrieved).toBeUndefined()
    })
  })

  describe('getAllTiles', () => {
    it('should return all tiles', () => {
      const terrainComposition = new Map([[TerrainType.PLAINS, 1.0]])
      manager.createTile('tile_1', 'Tile 1', terrainComposition)
      manager.createTile('tile_2', 'Tile 2', terrainComposition)
      
      const tiles = manager.getAllTiles()
      expect(tiles).toHaveLength(2)
    })
  })

  describe('addBuildingToTile', () => {
    it('should add building to tile', () => {
      const terrainComposition = new Map([[TerrainType.PLAINS, 1.0]])
      manager.createTile('tile_1', 'Test Tile', terrainComposition)
      
      manager.addBuildingToTile('tile_1', 'building_1')
      
      const updated = manager.getTile('tile_1')
      expect(updated?.buildings).toContain('building_1')
      expect(updated?.usedArea).toBe(5)
    })

    it('should throw error when tile has no space', () => {
      const terrainComposition = new Map([[TerrainType.PLAINS, 0.001]])
      manager.createTile('tile_1', 'Test Tile', terrainComposition)
      
      expect(() => {
        manager.addBuildingToTile('tile_1', 'building_1')
        manager.addBuildingToTile('tile_1', 'building_2')
      }).toThrow()
    })

    it('should throw error for non-existent tile', () => {
      expect(() => {
        manager.addBuildingToTile('non_existent', 'building_1')
      }).toThrow()
    })
  })

  describe('removeBuildingFromTile', () => {
    it('should remove building from tile', () => {
      const terrainComposition = new Map([[TerrainType.PLAINS, 1.0]])
      manager.createTile('tile_1', 'Test Tile', terrainComposition)
      manager.addBuildingToTile('tile_1', 'building_1')
      
      manager.removeBuildingFromTile('tile_1', 'building_1')
      
      const updated = manager.getTile('tile_1')
      expect(updated?.buildings).not.toContain('building_1')
      expect(updated?.usedArea).toBe(0)
    })

    it('should handle non-existent building gracefully', () => {
      const terrainComposition = new Map([[TerrainType.PLAINS, 1.0]])
      manager.createTile('tile_1', 'Test Tile', terrainComposition)
      
      expect(() => {
        manager.removeBuildingFromTile('tile_1', 'non_existent')
      }).not.toThrow()
    })
  })

  describe('discoverResource', () => {
    it('should discover resource on tile', () => {
      const terrainComposition = new Map([[TerrainType.PLAINS, 1.0]])
      manager.createTile('tile_1', 'Test Tile', terrainComposition)
      
      const deposit = manager.discoverResource('tile_1', 'iron')
      
      expect(deposit).toBeDefined()
      expect(deposit?.type).toBe('iron')
      expect(deposit?.isDiscovered).toBe(true)
    })

    it('should return existing resource if already discovered', () => {
      const terrainComposition = new Map([[TerrainType.PLAINS, 1.0]])
      manager.createTile('tile_1', 'Test Tile', terrainComposition)
      
      const first = manager.discoverResource('tile_1', 'iron')
      const second = manager.discoverResource('tile_1', 'iron')
      
      expect(first).toBe(second)
    })

    it('should add resource to tile', () => {
      const terrainComposition = new Map([[TerrainType.PLAINS, 1.0]])
      manager.createTile('tile_1', 'Test Tile', terrainComposition)
      
      manager.discoverResource('tile_1', 'iron')
      
      const updated = manager.getTile('tile_1')
      expect(updated?.resources).toHaveLength(1)
    })

    it('should return undefined for non-existent tile', () => {
      const deposit = manager.discoverResource('non_existent', 'iron')
      expect(deposit).toBeUndefined()
    })
  })

  describe('upgradeTransport', () => {
    it('should upgrade transport level', () => {
      const terrainComposition = new Map([[TerrainType.PLAINS, 1.0]])
      manager.createTile('tile_1', 'Test Tile', terrainComposition)
      
      manager.upgradeTransport('tile_1', 2)
      
      const updated = manager.getTile('tile_1')
      expect(updated?.roadLevel).toBe(2)
    })

    it('should throw error for invalid level', () => {
      const terrainComposition = new Map([[TerrainType.PLAINS, 1.0]])
      manager.createTile('tile_1', 'Test Tile', terrainComposition)
      
      expect(() => {
        manager.upgradeTransport('tile_1', 5)
      }).toThrow()
    })

    it('should throw error for non-existent tile', () => {
      expect(() => {
        manager.upgradeTransport('non_existent', 1)
      }).toThrow()
    })
  })

  describe('calculateDevelopmentExperience', () => {
    it('should add development experience', () => {
      const terrainComposition = new Map([[TerrainType.PLAINS, 1.0]])
      manager.createTile('tile_1', 'Test Tile', terrainComposition)
      
      manager.calculateDevelopmentExperience('tile_1', 50)
      
      const updated = manager.getTile('tile_1')
      expect(updated?.developmentExperience).toBe(50)
    })

    it('should increase development level when experience threshold reached', () => {
      const terrainComposition = new Map([[TerrainType.PLAINS, 1.0]])
      manager.createTile('tile_1', 'Test Tile', terrainComposition)
      
      manager.calculateDevelopmentExperience('tile_1', 100)
      
      const updated = manager.getTile('tile_1')
      expect(updated?.developmentLevel).toBe(1)
      expect(updated?.developmentExperience).toBe(0)
    })

    it('should apply development bonuses', () => {
      const terrainComposition = new Map([[TerrainType.PLAINS, 1.0]])
      const tile = manager.createTile('tile_1', 'Test Tile', terrainComposition)
      const initialBuildableArea = tile.buildableArea
      
      manager.calculateDevelopmentExperience('tile_1', 100)
      
      const updated = manager.getTile('tile_1')
      expect(updated?.buildableArea).toBeGreaterThan(initialBuildableArea)
    })

    it('should handle non-existent tile gracefully', () => {
      expect(() => {
        manager.calculateDevelopmentExperience('non_existent', 50)
      }).not.toThrow()
    })
  })
})
