import { PriceCalculator, PriceManager, StorageCapacityManager, TradeManager } from '../index'
import { GameState, createInitialState } from '../../../models/gameState'
import { Tile } from '../../../models/tile'

describe('Economy System', () => {
  describe('PriceCalculator', () => {
    let calculator: PriceCalculator

    beforeEach(() => {
      calculator = new PriceCalculator()
    })

    describe('getInventoryRatio', () => {
      it('should return 0 for zero capacity', () => {
        expect(calculator.getInventoryRatio(100, 0)).toBe(0)
      })

      it('should return correct ratio for normal case', () => {
        expect(calculator.getInventoryRatio(500, 1000)).toBe(0.5)
      })

      it('should cap ratio at 1', () => {
        expect(calculator.getInventoryRatio(1500, 1000)).toBe(1)
      })

      it('should not go below 0', () => {
        expect(calculator.getInventoryRatio(-100, 1000)).toBe(0)
      })
    })

    describe('calculatePriceMultiplier', () => {
      it('should return 5x for 0% inventory', () => {
        expect(calculator.calculatePriceMultiplier(0, 1000)).toBeCloseTo(5.0, 2)
      })

      it('should return 3.25x for 10% inventory', () => {
        expect(calculator.calculatePriceMultiplier(100, 1000)).toBeCloseTo(3.25, 2)
      })

      it('should return 1.5x for 20% inventory', () => {
        expect(calculator.calculatePriceMultiplier(200, 1000)).toBeCloseTo(1.5, 2)
      })

      it('should return 1.25x for 35% inventory', () => {
        expect(calculator.calculatePriceMultiplier(350, 1000)).toBeCloseTo(1.25, 2)
      })

      it('should return 1x for 50% inventory', () => {
        expect(calculator.calculatePriceMultiplier(500, 1000)).toBeCloseTo(1.0, 2)
      })

      it('should return 0.835x for 65% inventory', () => {
        expect(calculator.calculatePriceMultiplier(650, 1000)).toBeCloseTo(0.835, 2)
      })

      it('should return 0.67x for 80% inventory', () => {
        expect(calculator.calculatePriceMultiplier(800, 1000)).toBeCloseTo(0.67, 2)
      })

      it('should return 0.44x for 90% inventory', () => {
        expect(calculator.calculatePriceMultiplier(900, 1000)).toBeCloseTo(0.44, 2)
      })

      it('should return 0.2x for 100% inventory', () => {
        expect(calculator.calculatePriceMultiplier(1000, 1000)).toBeCloseTo(0.2, 2)
      })

      it('should return 1.0 for zero capacity', () => {
        expect(calculator.calculatePriceMultiplier(100, 0)).toBe(1.0)
      })
    })

    describe('calculatePrice', () => {
      it('should calculate price based on base price and multiplier', () => {
        const basePrice = 100
        const price = calculator.calculatePrice(basePrice, 500, 1000)
        expect(price).toBeCloseTo(100, 2)
      })

      it('should return 5x base price for 0% inventory', () => {
        const basePrice = 100
        const price = calculator.calculatePrice(basePrice, 0, 1000)
        expect(price).toBeCloseTo(500, 2)
      })

      it('should return 0.2x base price for 100% inventory', () => {
        const basePrice = 100
        const price = calculator.calculatePrice(basePrice, 1000, 1000)
        expect(price).toBeCloseTo(20, 2)
      })
    })
  })

  describe('StorageCapacityManager', () => {
    let manager: StorageCapacityManager
    let state: GameState

    beforeEach(() => {
      state = createInitialState() as GameState
      state.id = 'test-game'
      state.name = 'Test Game'
      state.version = '1.0.0'

      const tile: Tile = {
        id: 'tile1',
        name: 'Test Tile',
        terrainComposition: new Map([['plains', 1]]),
        totalArea: 1000,
        buildableArea: 800,
        usedArea: 0,
        resources: [],
        buildings: [],
        storage: new Map([['grain', 100]]),
        isExplored: true,
        isControlled: true,
        controlCost: 0,
        roadLevel: 0,
        developmentLevel: 0,
        developmentExperience: 0
      }
      state.tiles.set('tile1', tile)

      manager = new StorageCapacityManager(state)
    })

    describe('getBaseCapacity', () => {
      it('should return default base capacity of 1000', () => {
        expect(manager.getBaseCapacity('grain')).toBe(1000)
      })
    })

    describe('getWarehouseBonus', () => {
      it('should return 0 for level 0', () => {
        expect(manager.getWarehouseBonus(0)).toBe(0)
      })

      it('should return 1000 for level 1', () => {
        expect(manager.getWarehouseBonus(1)).toBe(1000)
      })

      it('should return 2000 for level 2', () => {
        expect(manager.getWarehouseBonus(2)).toBe(2000)
      })

      it('should return 3000 for level 3', () => {
        expect(manager.getWarehouseBonus(3)).toBe(3000)
      })
    })

    describe('getCapacity', () => {
      it('should return base capacity when no custom capacity set', () => {
        expect(manager.getCapacity('tile1', 'grain')).toBe(1000)
      })

      it('should return custom capacity when set', () => {
        manager.setCapacity('tile1', 'grain', 2000)
        expect(manager.getCapacity('tile1', 'grain')).toBe(2000)
      })
    })

    describe('setCapacity', () => {
      it('should set capacity for tile and goods', () => {
        manager.setCapacity('tile1', 'grain', 3000)
        expect(manager.getCapacity('tile1', 'grain')).toBe(3000)
      })

      it('should not allow negative capacity', () => {
        manager.setCapacity('tile1', 'grain', -100)
        expect(manager.getCapacity('tile1', 'grain')).toBe(0)
      })
    })

    describe('updateCapacityFromWarehouse', () => {
      it('should update capacity for level 1 warehouse', () => {
        manager.updateCapacityFromWarehouse('tile1', 1)
        expect(manager.getCapacity('tile1', 'grain')).toBe(2000)
      })

      it('should update capacity for level 2 warehouse', () => {
        manager.updateCapacityFromWarehouse('tile1', 2)
        expect(manager.getCapacity('tile1', 'grain')).toBe(3000)
      })

      it('should update capacity for level 3 warehouse', () => {
        manager.updateCapacityFromWarehouse('tile1', 3)
        expect(manager.getCapacity('tile1', 'grain')).toBe(4000)
      })
    })

    describe('isFull', () => {
      it('should return false when inventory below capacity', () => {
        expect(manager.isFull('tile1', 'grain', 500)).toBe(false)
      })

      it('should return true when inventory equals capacity', () => {
        expect(manager.isFull('tile1', 'grain', 1000)).toBe(true)
      })

      it('should return true when inventory exceeds capacity', () => {
        expect(manager.isFull('tile1', 'grain', 1500)).toBe(true)
      })
    })

    describe('getWarehouseLevelCapacity', () => {
      it('should return total capacity for warehouse level', () => {
        expect(manager.getWarehouseLevelCapacity(0)).toBe(1000)
        expect(manager.getWarehouseLevelCapacity(1)).toBe(2000)
        expect(manager.getWarehouseLevelCapacity(2)).toBe(3000)
        expect(manager.getWarehouseLevelCapacity(3)).toBe(4000)
      })
    })
  })

  describe('PriceManager', () => {
    let manager: PriceManager
    let state: GameState

    beforeEach(() => {
      state = createInitialState() as GameState
      state.id = 'test-game'
      state.name = 'Test Game'
      state.version = '1.0.0'

      const tile: Tile = {
        id: 'tile1',
        name: 'Test Tile',
        terrainComposition: new Map([['plains', 1]]),
        totalArea: 1000,
        buildableArea: 800,
        usedArea: 0,
        resources: [],
        buildings: [],
        storage: new Map([['grain', 500]]),
        isExplored: true,
        isControlled: true,
        controlCost: 0,
        roadLevel: 0,
        developmentLevel: 0,
        developmentExperience: 0
      }
      state.tiles.set('tile1', tile)

      manager = new PriceManager(state)
    })

    describe('getBasePrice', () => {
      it('should return base price from goods config', () => {
        expect(manager.getBasePrice('grain')).toBe(10)
      })

      it('should return custom base price when set', () => {
        manager.setBasePrice('grain', 20)
        expect(manager.getBasePrice('grain')).toBe(20)
      })

      it('should return default price for unknown goods', () => {
        expect(manager.getBasePrice('unknown')).toBe(10)
      })
    })

    describe('setBasePrice', () => {
      it('should set custom base price', () => {
        manager.setBasePrice('grain', 15)
        expect(manager.getBasePrice('grain')).toBe(15)
      })

      it('should not allow negative price', () => {
        manager.setBasePrice('grain', -10)
        expect(manager.getBasePrice('grain')).toBe(0)
      })
    })

    describe('getPrice', () => {
      it('should calculate price based on inventory ratio', () => {
        const price = manager.getPrice('tile1', 'grain')
        expect(price).toBeGreaterThan(0)
      })

      it('should return price close to base price for 50% inventory', () => {
        const price = manager.getPrice('tile1', 'grain')
        expect(price).toBeCloseTo(10, 0)
      })
    })

    describe('getStorageCapacity', () => {
      it('should return default capacity', () => {
        expect(manager.getStorageCapacity('tile1', 'grain')).toBe(1000)
      })
    })

    describe('setStorageCapacity', () => {
      it('should set custom capacity', () => {
        manager.setStorageCapacity('tile1', 'grain', 2000)
        expect(manager.getStorageCapacity('tile1', 'grain')).toBe(2000)
      })
    })

    describe('updateStorageCapacityFromWarehouse', () => {
      it('should update capacity based on warehouse level', () => {
        manager.updateStorageCapacityFromWarehouse('tile1', 2)
        expect(manager.getStorageCapacity('tile1', 'grain')).toBe(3000)
      })
    })

    describe('updateTilePrices', () => {
      it('should update prices for all goods in tile', () => {
        const date = { year: 1, month: 1, day: 1 }
        manager.updateTilePrices('tile1', date)
        const history = manager.getPriceHistory('tile1', 'grain')
        expect(history.length).toBe(1)
        expect(history[0].date).toEqual(date)
      })
    })

    describe('updateAllPrices', () => {
      it('should update prices for all tiles', () => {
        const tile2: Tile = {
        id: 'tile2',
        name: 'Test Tile 2',
        terrainComposition: new Map([['plains', 1]]),
        totalArea: 1000,
        buildableArea: 800,
        usedArea: 0,
        resources: [],
        buildings: [],
        storage: new Map([['wood', 100]]),
        isExplored: true,
        isControlled: true,
        controlCost: 0,
        roadLevel: 0,
        developmentLevel: 0,
        developmentExperience: 0
      }
        state.tiles.set('tile2', tile2)
        manager.updateState(state)

        const date = { year: 1, month: 1, day: 1 }
        manager.updateAllPrices(date)

        const history1 = manager.getPriceHistory('tile1', 'grain')
        const history2 = manager.getPriceHistory('tile2', 'wood')
        expect(history1.length).toBe(1)
        expect(history2.length).toBe(1)
      })
    })

    describe('getPriceHistory', () => {
      it('should return empty array for no history', () => {
        const history = manager.getPriceHistory('tile1', 'unknown')
        expect(history).toEqual([])
      })

      it('should return history after update', () => {
        const date = { year: 1, month: 1, day: 1 }
        manager.updateTilePrices('tile1', date)
        const history = manager.getPriceHistory('tile1', 'grain')
        expect(history.length).toBe(1)
        expect(history[0].price).toBeGreaterThan(0)
        expect(history[0].inventory).toBe(500)
        expect(history[0].capacity).toBe(1000)
        expect(history[0].ratio).toBe(0.5)
      })
    })

    describe('recordPrice', () => {
      it('should record price entry', () => {
        const date = { year: 1, month: 2, day: 1 }
        manager.recordPrice('tile1', 'grain', date)
        const history = manager.getPriceHistory('tile1', 'grain')
        expect(history.length).toBe(1)
        expect(history[0].date).toEqual(date)
      })
    })
  })

  describe('TradeManager', () => {
    let manager: TradeManager

    beforeEach(() => {
      manager = new TradeManager()
    })

    describe('createRoute', () => {
      it('should create trade route', () => {
        const route = manager.createRoute('route_1', 'market_1', 'market_2', ['wood'])
        
        expect(route).toBeDefined()
        expect(route.id).toBe('route_1')
        expect(route.fromMarketId).toBe('market_1')
        expect(route.toMarketId).toBe('market_2')
      })
    })

    describe('executeTradeOnRoute', () => {
      it('should execute trade on route', () => {
        manager.createRoute('route_1', 'market_1', 'market_2', ['wood'])
        
        const trade = manager.executeTradeOnRoute('route_1', 'wood', 10)
        
        expect(trade).toBeDefined()
        expect(trade.goods).toBeDefined()
        expect(trade.goods[0].goodsId).toBe('wood')
        expect(trade.goods[0].amount).toBe(10)
      })

      it('should throw error for non-existent route', () => {
        expect(() => manager.executeTradeOnRoute('non_existent', 'wood', 10)).toThrow()
      })
    })

    describe('getRoute', () => {
      it('should return route by ID', () => {
        const route = manager.createRoute('route_1', 'market_1', 'market_2', ['wood'])
        const retrieved = manager.getRoute('route_1')
        
        expect(retrieved).toBe(route)
      })

      it('should return undefined for non-existent route', () => {
        expect(manager.getRoute('non_existent')).toBeUndefined()
      })
    })

    describe('getAllRoutes', () => {
      it('should return all routes', () => {
        manager.createRoute('route_1', 'market_1', 'market_2', ['wood'])
        manager.createRoute('route_2', 'market_3', 'market_4', ['food'])
        
        const routes = manager.getAllRoutes()
        expect(routes).toHaveLength(2)
      })
    })

    describe('removeRoute', () => {
      it('should remove route', () => {
        manager.createRoute('route_1', 'market_1', 'market_2', ['wood'])
        manager.removeRoute('route_1')
        
        expect(manager.getRoute('route_1')).toBeUndefined()
      })
    })
  })
})
