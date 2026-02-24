import { StorageManager } from '../storageManager'
import { GameState } from '../../../models/gameState'
import { Era } from '../../../models/baseTypes'

describe('StorageManager', () => {
  let gameState: GameState

  beforeEach(() => {
    gameState = {
      id: 'test-game',
      name: 'Test Game',
      version: '1.0.0',
      date: { year: 1, month: 1, day: 1 },
      era: Era.STONE_AGE,
      tickCount: 0,
      isPaused: false,
      timeMultiplier: 1,
      tiles: new Map([
        ['tile-1', {
          id: 'tile-1',
          name: 'Tile 1',
          terrainComposition: new Map(),
          totalArea: 100,
          buildableArea: 100,
          usedArea: 0,
          resources: [],
          buildings: [],
          storage: new Map([['grain', 100], ['wood', 50]]),
          isExplored: true,
          isControlled: true,
          controlCost: 0,
          roadLevel: 0,
          developmentLevel: 0,
          developmentExperience: 0
        }],
        ['tile-2', {
          id: 'tile-2',
          name: 'Tile 2',
          terrainComposition: new Map(),
          totalArea: 100,
          buildableArea: 100,
          usedArea: 0,
          resources: [],
          buildings: [],
          storage: new Map([['stone', 200]]),
          isExplored: true,
          isControlled: true,
          controlCost: 0,
          roadLevel: 0,
          developmentLevel: 0,
          developmentExperience: 0
        }]
      ]),
      buildings: new Map(),
      populations: new Map(),
      markets: new Map(),
      technologies: new Set(),
      researchQueue: {
        current: null,
        queue: [],
        researchSpeed: 1
      },
      resources: {
        money: 1000,
        goods: new Map()
      },
      globalStorage: new Map([['grain', 100], ['wood', 50], ['stone', 200]]),
      settings: {
        gameSpeed: 1,
        autoSaveInterval: 300,
        difficulty: 'normal',
        enabledFeatures: {
          events: true,
          disasters: true,
          wars: true,
          trade: true
        }
      },
      notifications: []
    }
  })

  describe('Tile Storage Operations', () => {
    it('should get tile storage', () => {
      const manager = new StorageManager(gameState)
      const storage = manager.getTileStorage('tile-1')

      expect(storage.get('grain')).toBe(100)
      expect(storage.get('wood')).toBe(50)
    })

    it('should get goods from tile', () => {
      const manager = new StorageManager(gameState)

      expect(manager.getGoodsFromTile('tile-1', 'grain')).toBe(100)
      expect(manager.getGoodsFromTile('tile-1', 'wood')).toBe(50)
      expect(manager.getGoodsFromTile('tile-1', 'stone')).toBe(0)
    })

    it('should check if tile has enough goods', () => {
      const manager = new StorageManager(gameState)

      expect(manager.hasGoodsInTile('tile-1', 'grain', 50)).toBe(true)
      expect(manager.hasGoodsInTile('tile-1', 'grain', 100)).toBe(true)
      expect(manager.hasGoodsInTile('tile-1', 'grain', 150)).toBe(false)
    })

    it('should add goods to tile', () => {
      const manager = new StorageManager(gameState)
      const result = manager.addGoodsToTile('tile-1', 'iron', 100)

      expect(result.success).toBe(true)
      expect(result.actualAmount).toBe(100)
      expect(manager.getGoodsFromTile('tile-1', 'iron')).toBe(100)
    })

    it('should add goods to existing tile goods', () => {
      const manager = new StorageManager(gameState)
      const result = manager.addGoodsToTile('tile-1', 'grain', 50)

      expect(result.success).toBe(true)
      expect(result.actualAmount).toBe(50)
      expect(manager.getGoodsFromTile('tile-1', 'grain')).toBe(150)
    })

    it('should remove goods from tile', () => {
      const manager = new StorageManager(gameState)
      const result = manager.removeGoodsFromTile('tile-1', 'grain', 50)

      expect(result.success).toBe(true)
      expect(result.actualAmount).toBe(50)
      expect(manager.getGoodsFromTile('tile-1', 'grain')).toBe(50)
    })

    it('should not remove more than available', () => {
      const manager = new StorageManager(gameState)
      const result = manager.removeGoodsFromTile('tile-1', 'grain', 150)

      expect(result.success).toBe(true)
      expect(result.actualAmount).toBe(100)
      expect(manager.getGoodsFromTile('tile-1', 'grain')).toBe(0)
    })

    it('should set goods in tile', () => {
      const manager = new StorageManager(gameState)
      const result = manager.setGoodsInTile('tile-1', 'grain', 200)

      expect(result.success).toBe(true)
      expect(result.actualAmount).toBe(200)
      expect(manager.getGoodsFromTile('tile-1', 'grain')).toBe(200)
    })

    it('should fail to add goods to non-existent tile', () => {
      const manager = new StorageManager(gameState)
      const result = manager.addGoodsToTile('tile-999', 'grain', 100)

      expect(result.success).toBe(false)
      expect(result.actualAmount).toBe(0)
      expect(result.message).toContain('not found')
    })

    it('should clear tile storage', () => {
      const manager = new StorageManager(gameState)
      manager.clearTileStorage('tile-1')

      expect(manager.getGoodsFromTile('tile-1', 'grain')).toBe(0)
      expect(manager.getGoodsFromTile('tile-1', 'wood')).toBe(0)
    })

    it('should get tile storage summary', () => {
      const manager = new StorageManager(gameState)
      const summary = manager.getTileStorageSummary('tile-1')

      expect(summary).not.toBeNull()
      expect(summary?.tileId).toBe('tile-1')
      expect(summary?.tileName).toBe('Tile 1')
      expect(summary?.totalItems).toBe(150)
      expect(summary?.goods.get('grain')).toBe(100)
    })
  })

  describe('Global Storage Operations', () => {
    it('should get global storage', () => {
      const manager = new StorageManager(gameState)
      const storage = manager.getGlobalStorage()

      expect(storage.get('grain')).toBe(100)
      expect(storage.get('wood')).toBe(50)
      expect(storage.get('stone')).toBe(200)
    })

    it('should get goods from global storage', () => {
      const manager = new StorageManager(gameState)

      expect(manager.getGoodsFromGlobal('grain')).toBe(100)
      expect(manager.getGoodsFromGlobal('wood')).toBe(50)
    })

    it('should check if global storage has enough goods', () => {
      const manager = new StorageManager(gameState)

      expect(manager.hasGoodsInGlobal('grain', 50)).toBe(true)
      expect(manager.hasGoodsInGlobal('grain', 100)).toBe(true)
      expect(manager.hasGoodsInGlobal('grain', 150)).toBe(false)
    })

    it('should add goods to global storage', () => {
      const manager = new StorageManager(gameState)
      const result = manager.addGoodsToGlobal('iron', 100)

      expect(result.success).toBe(true)
      expect(result.actualAmount).toBe(100)
      expect(manager.getGoodsFromGlobal('iron')).toBe(100)
    })

    it('should remove goods from global storage', () => {
      const manager = new StorageManager(gameState)
      const result = manager.removeGoodsFromGlobal('grain', 50)

      expect(result.success).toBe(true)
      expect(result.actualAmount).toBe(50)
      expect(manager.getGoodsFromGlobal('grain')).toBe(50)
    })

    it('should set goods in global storage', () => {
      const manager = new StorageManager(gameState)
      const result = manager.setGoodsInGlobal('grain', 200)

      expect(result.success).toBe(true)
      expect(result.actualAmount).toBe(200)
      expect(manager.getGoodsFromGlobal('grain')).toBe(200)
    })

    it('should clear global storage', () => {
      const manager = new StorageManager(gameState)
      manager.clearGlobalStorage()

      expect(manager.getGoodsFromGlobal('grain')).toBe(0)
      expect(manager.getGoodsFromGlobal('wood')).toBe(0)
    })

    it('should get global storage summary', () => {
      const manager = new StorageManager(gameState)
      const summary = manager.getGlobalStorageSummary()

      expect(summary.totalItems).toBe(350)
      expect(summary.goods.get('grain')).toBe(100)
      expect(summary.goods.get('wood')).toBe(50)
      expect(summary.goods.get('stone')).toBe(200)
    })
  })

  describe('Transfer Operations', () => {
    it('should transfer goods from tile to global', () => {
      const manager = new StorageManager(gameState)
      const result = manager.transferGoodsToGlobal('tile-1', 'grain', 50)

      expect(result.success).toBe(true)
      expect(result.actualAmount).toBe(50)
      expect(manager.getGoodsFromTile('tile-1', 'grain')).toBe(50)
      expect(manager.getGoodsFromGlobal('grain')).toBe(150)
    })

    it('should fail to transfer insufficient goods', () => {
      const manager = new StorageManager(gameState)
      const result = manager.transferGoodsToGlobal('tile-1', 'grain', 200)

      expect(result.success).toBe(false)
      expect(result.actualAmount).toBe(0)
      expect(result.message).toContain('Insufficient')
    })
  })

  describe('Summary and List Operations', () => {
    it('should get all tile storage summaries', () => {
      const manager = new StorageManager(gameState)
      const summaries = manager.getAllTileStorageSummaries()

      expect(summaries).toHaveLength(2)
      expect(summaries[0].tileId).toBe('tile-1')
      expect(summaries[0].totalItems).toBe(150)
      expect(summaries[1].tileId).toBe('tile-2')
      expect(summaries[1].totalItems).toBe(200)
    })

    it('should get goods list from tile', () => {
      const manager = new StorageManager(gameState)
      const list = manager.getGoodsList('tile-1')

      expect(list).toHaveLength(2)
      expect(list.find(item => item.goodsId === 'grain')?.amount).toBe(100)
      expect(list.find(item => item.goodsId === 'wood')?.amount).toBe(50)
    })

    it('should get global goods list', () => {
      const manager = new StorageManager(gameState)
      const list = manager.getGlobalGoodsList()

      expect(list).toHaveLength(3)
      expect(list.find(item => item.goodsId === 'grain')?.amount).toBe(100)
    })
  })

  describe('Global Storage Sync', () => {
    it('should sync global storage from tiles', () => {
      const manager = new StorageManager(gameState)
      manager.clearGlobalStorage()
      manager.syncGlobalStorageFromTiles()

      expect(manager.getGoodsFromGlobal('grain')).toBe(100)
      expect(manager.getGoodsFromGlobal('wood')).toBe(50)
      expect(manager.getGoodsFromGlobal('stone')).toBe(200)
    })
  })

  describe('State Update', () => {
    it('should update state reference', () => {
      const manager = new StorageManager(gameState)

      const newGameState = {
        ...gameState,
        globalStorage: new Map([['iron', 500]])
      }

      manager.updateState(newGameState)
      const storage = manager.getGlobalStorage()

      expect(storage.get('iron')).toBe(500)
      expect(storage.get('grain')).toBeUndefined()
    })
  })
})
