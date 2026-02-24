import { rootReducer, batchActions } from '../reducers'
import { GameState } from '../../models/gameState'
import { Era } from '../../models/baseTypes'
import { tickTime, setPause, setResume, setTimeMultiplier, createBuilding, upgradeBuilding, removeBuilding, setProductionMethod, setWorkers, assignWorker, removeWorker, updatePopulation, addSupply, addDemand, executeTransaction, addTechToQueue, removeTechFromQueue, unlockTech, addNotification, removeNotification } from '../actions'
import { BuildingType } from '../../models/baseTypes'

describe('Reducers', () => {
  let initialState: GameState

  beforeEach(() => {
    initialState = {
      id: 'test-game',
      name: 'Test Game',
      version: '1.0.0',
      date: { year: 1, month: 1, day: 1 },
      era: Era.STONE_AGE,
      tickCount: 0,
      isPaused: false,
      timeMultiplier: 1,
      tiles: new Map([['tile-1', { id: 'tile-1', name: 'Test Tile', terrainComposition: new Map(), totalArea: 100, buildableArea: 100, usedArea: 0, resources: [], buildings: [], storage: new Map(), isExplored: false, isControlled: false, controlCost: 0, roadLevel: 0, developmentLevel: 0, developmentExperience: 0 }]]),
      buildings: new Map([['building-1', { id: 'building-1', name: 'Farm', type: BuildingType.FARM, minEra: Era.STONE_AGE, constructionCost: {}, constructionTime: 30, baseWorkers: 10, maxWorkers: 20, currentWorkers: 0, baseThroughput: 100, productionMethods: [], level: 1, experience: 0, tileId: 'tile-1' }]]),
      populations: new Map([['pop-1', { id: 'pop-1', tileId: 'tile-1', totalPopulation: 100, groups: [{ id: 'group-1', size: 50, ageGroup: 'adult' as any, education: 'basic' as any, socialClass: 'worker' as any, employment: 'employed' as any, workplace: 'building-1', profession: 'farmer', wage: 10, wealth: 100, livingStandard: 50, needs: { survival: 100, basic: 80, improved: 50, luxury: 20 } }], ageDistribution: { children: 30, adults: 60, elders: 10 }, educationDistribution: {} as any, classDistribution: {} as any, employment: { total: 100, employed: 50, unemployed: 50, retired: 0 }, averageWage: 10, averageLivingStandard: 50, birthRate: 0.02, deathRate: 0.01, netMigration: 0 }]]),
      markets: new Map([['market-1', { id: 'market-1', name: 'Market 1', regions: ['region-1'], prices: new Map([['wood', { basePrice: 10, currentPrice: 10, previousPrice: 10, history: [] }]]), supply: new Map([['wood', 100]]), demand: new Map([['wood', 50]]), stockpile: new Map(), events: [] }]]),
      technologies: new Set(['tech-1']),
      researchQueue: {
        current: null,
        queue: ['tech-2'],
        researchSpeed: 1
      },
      resources: {
        money: 1000,
        goods: new Map([['wood', 100]])
      },
      globalStorage: new Map(),
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

  describe('tickTimeReducer', () => {
    it('should increment tick count', () => {
      const action = tickTime(10)
      const newState = rootReducer(initialState, action)
      
      expect(newState.tickCount).toBe(1)
    })

    it('should advance date correctly', () => {
      const action = tickTime(40)
      const newState = rootReducer(initialState, action)
      
      expect(newState.date.month).toBe(2)
      expect(newState.date.day).toBe(11)
    })

    it('should advance year when days exceed year', () => {
      const action = tickTime(400)
      const newState = rootReducer(initialState, action)
      
      expect(newState.date.year).toBe(2)
    })
  })

  describe('pauseReducer', () => {
    it('should set paused state', () => {
      const action = setPause()
      const newState = rootReducer(initialState, action)
      
      expect(newState.isPaused).toBe(true)
    })

    it('should resume game', () => {
      const action = setResume()
      const newState = rootReducer(initialState, action)
      
      expect(newState.isPaused).toBe(false)
    })
  })

  describe('timeMultiplierReducer', () => {
    it('should set time multiplier', () => {
      const action = setTimeMultiplier(5)
      const newState = rootReducer(initialState, action)
      
      expect(newState.timeMultiplier).toBe(5)
    })
  })

  describe('createBuildingReducer', () => {
    it('should create new building', () => {
      const action = createBuilding('building-2', BuildingType.FARM, 'tile-1')
      const newState = rootReducer(initialState, action)
      
      expect(newState.buildings.has('building-2')).toBe(true)
      const building = newState.buildings.get('building-2')
      expect(building?.name).toBe('农田')
      expect(building?.level).toBe(1)
    })

    it('should not create building for invalid type', () => {
      const invalidAction: any = { type: 'CREATE_BUILDING', payload: { id: 'test', type: 'INVALID_TYPE', tileId: 'tile-1' }, timestamp: Date.now() }
      const newState = rootReducer(initialState, invalidAction)
      
      expect(newState.buildings.size).toBe(1)
    })
  })

  describe('upgradeBuildingReducer', () => {
    it('should upgrade building', () => {
      const action = upgradeBuilding('building-1', 2)
      const newState = rootReducer(initialState, action)
      
      const building = newState.buildings.get('building-1')
      expect(building?.level).toBe(2)
    })

    it('should not modify non-existent building', () => {
      const action = upgradeBuilding('non-existent', 2)
      const newState = rootReducer(initialState, action)
      
      expect(newState.buildings.size).toBe(1)
    })
  })

  describe('removeBuildingReducer', () => {
    it('should remove building', () => {
      const action = removeBuilding('building-1')
      const newState = rootReducer(initialState, action)
      
      expect(newState.buildings.has('building-1')).toBe(false)
    })

    it('should handle removing non-existent building', () => {
      const action = removeBuilding('non-existent')
      const newState = rootReducer(initialState, action)
      
      expect(newState.buildings.size).toBe(1)
    })
  })

  describe('setProductionMethodReducer', () => {
    it('should set production method for building', () => {
      const buildingWithMethods: any = {
        ...initialState,
        buildings: new Map([['building-1', { ...initialState.buildings.get('building-1'), productionMethods: ['method-1', 'method-2'] }]])
      }
      
      const action = setProductionMethod('building-1', 'method-2')
      const newState = rootReducer(buildingWithMethods, action)
      
      const building = newState.buildings.get('building-1')
      expect(building?.productionMethods).toEqual(['method-2'])
    })

    it('should not set invalid production method', () => {
      const action = setProductionMethod('building-1', 'invalid-method')
      const newState = rootReducer(initialState, action)
      
      const building = newState.buildings.get('building-1')
      expect(building?.productionMethods).toEqual([])
    })
  })

  describe('setWorkersReducer', () => {
    it('should set workers for building', () => {
      const action = setWorkers('building-1', 10)
      const newState = rootReducer(initialState, action)
      
      const building = newState.buildings.get('building-1')
      expect(building?.currentWorkers).toBe(10)
    })

    it('should not exceed max workers', () => {
      const action = setWorkers('building-1', 50)
      const newState = rootReducer(initialState, action)
      
      const building = newState.buildings.get('building-1')
      expect(building?.currentWorkers).toBe(20)
    })

    it('should not be negative', () => {
      const action = setWorkers('building-1', -5)
      const newState = rootReducer(initialState, action)
      
      const building = newState.buildings.get('building-1')
      expect(building?.currentWorkers).toBe(0)
    })

    it('should not modify non-existent building', () => {
      const action = setWorkers('non-existent', 10)
      const newState = rootReducer(initialState, action)
      
      expect(newState.buildings.size).toBe(1)
    })
  })

  describe('assignWorkerReducer', () => {
    it('should assign worker to building', () => {
      const action = assignWorker('pop-1', 'building-1', 'group-1')
      const newState = rootReducer(initialState, action)
      
      const population = newState.populations.get('pop-1')
      const group = population?.groups.find(g => g.id === 'group-1')
      expect(group?.workplace).toBe('building-1')
    })

    it('should handle non-existent population', () => {
      const action = assignWorker('non-existent', 'building-1', 'group-1')
      const newState = rootReducer(initialState, action)
      
      expect(newState).toEqual(initialState)
    })
  })

  describe('removeWorkerReducer', () => {
    it('should remove worker from building', () => {
      const action = removeWorker('pop-1', 'building-1', 'group-1')
      const newState = rootReducer(initialState, action)
      
      const population = newState.populations.get('pop-1')
      const group = population?.groups.find(g => g.id === 'group-1')
      expect(group?.workplace).toBeUndefined()
    })
  })

  describe('updatePopulationReducer', () => {
    it('should update population', () => {
      const action = updatePopulation('pop-1', { totalPopulation: 200 })
      const newState = rootReducer(initialState, action)
      
      const population = newState.populations.get('pop-1')
      expect(population?.totalPopulation).toBe(200)
    })

    it('should handle non-existent population', () => {
      const action = updatePopulation('non-existent', { totalPopulation: 200 })
      const newState = rootReducer(initialState, action)
      
      expect(newState).toEqual(initialState)
    })
  })

  describe('addSupplyReducer', () => {
    it('should add supply to market', () => {
      const action = addSupply('market-1', 'wood', 50)
      const newState = rootReducer(initialState, action)
      
      const market = newState.markets.get('market-1')
      expect(market?.supply.get('wood')).toBe(150)
    })

    it('should handle non-existent market', () => {
      const action = addSupply('non-existent', 'wood', 50)
      const newState = rootReducer(initialState, action)
      
      expect(newState).toEqual(initialState)
    })
  })

  describe('addDemandReducer', () => {
    it('should add demand to market', () => {
      const action = addDemand('market-1', 'wood', 30)
      const newState = rootReducer(initialState, action)
      
      const market = newState.markets.get('market-1')
      expect(market?.demand.get('wood')).toBe(80)
    })
  })

  describe('executeTransactionReducer', () => {
    it('should execute transaction and update supply/demand', () => {
      const action = executeTransaction('market-1', 'wood', 20, 15)
      const newState = rootReducer(initialState, action)
      
      const market = newState.markets.get('market-1')
      expect(market?.supply.get('wood')).toBe(80)
      expect(market?.demand.get('wood')).toBe(30)
      
      const price = market?.prices.get('wood')
      expect(price?.currentPrice).toBe(15)
    })
  })

  describe('addTechToQueueReducer', () => {
    it('should add tech to queue', () => {
      const action = addTechToQueue('tech-3')
      const newState = rootReducer(initialState, action)
      
      expect(newState.researchQueue.queue).toContain('tech-3')
    })

    it('should not add already researched tech', () => {
      const action = addTechToQueue('tech-1')
      const newState = rootReducer(initialState, action)
      
      expect(newState.researchQueue.queue.filter(id => id === 'tech-1')).toHaveLength(0)
    })

    it('should not add duplicate tech to queue', () => {
      const action = addTechToQueue('tech-2')
      const newState = rootReducer(initialState, action)
      
      expect(newState.researchQueue.queue.filter(id => id === 'tech-2')).toHaveLength(1)
    })
  })

  describe('removeTechFromQueueReducer', () => {
    it('should remove tech from queue', () => {
      const action = removeTechFromQueue('tech-2')
      const newState = rootReducer(initialState, action)
      
      expect(newState.researchQueue.queue).not.toContain('tech-2')
    })
  })

  describe('unlockTechReducer', () => {
    it('should unlock tech', () => {
      const action = unlockTech('tech-3')
      const newState = rootReducer(initialState, action)
      
      expect(newState.technologies.has('tech-3')).toBe(true)
    })

    it('should remove tech from queue when unlocked', () => {
      const action = unlockTech('tech-2')
      const newState = rootReducer(initialState, action)
      
      expect(newState.technologies.has('tech-2')).toBe(true)
      expect(newState.researchQueue.queue).not.toContain('tech-2')
    })

    it('should not duplicate already unlocked tech', () => {
      const action = unlockTech('tech-1')
      const newState = rootReducer(initialState, action)
      
      expect(newState.technologies.size).toBe(1)
    })
  })

  describe('addNotificationReducer', () => {
    it('should add notification', () => {
      const action = addNotification('notif-1', 'info', 'Info', 'Test message')
      const newState = rootReducer(initialState, action)
      
      expect(newState.notifications).toHaveLength(1)
      expect(newState.notifications[0].id).toBe('notif-1')
      expect(newState.notifications[0].type).toBe('info')
    })

    it('should add multiple notifications', () => {
      const action1 = addNotification('notif-1', 'info', 'Info', 'Test message')
      const action2 = addNotification('notif-2', 'warning', 'Warning', 'Warning message')
      let newState = rootReducer(initialState, action1)
      newState = rootReducer(newState, action2)
      
      expect(newState.notifications).toHaveLength(2)
    })
  })

  describe('removeNotificationReducer', () => {
    it('should remove notification', () => {
      const addAction = addNotification('notif-1', 'info', 'Info', 'Test message')
      let newState = rootReducer(initialState, addAction)
      
      const removeAction = removeNotification('notif-1')
      newState = rootReducer(newState, removeAction)
      
      expect(newState.notifications).toHaveLength(0)
    })

    it('should handle removing non-existent notification', () => {
      const action = removeNotification('non-existent')
      const newState = rootReducer(initialState, action)
      
      expect(newState.notifications).toHaveLength(0)
    })
  })

  describe('batchActions', () => {
    it('should process multiple actions', () => {
      const actions = [
        setPause(),
        setTimeMultiplier(3),
        addNotification('notif-1', 'info', 'Info', 'Test')
      ]
      
      const newState = batchActions(initialState, actions)
      
      expect(newState.isPaused).toBe(true)
      expect(newState.timeMultiplier).toBe(3)
      expect(newState.notifications).toHaveLength(1)
    })

    it('should handle empty action array', () => {
      const newState = batchActions(initialState, [])
      
      expect(newState).toEqual(initialState)
    })
  })

  describe('unknown action', () => {
    it('should return unchanged state', () => {
      const action: any = { type: 'UNKNOWN_ACTION', payload: {}, timestamp: Date.now() }
      const newState = rootReducer(initialState, action)
      
      expect(newState).toEqual(initialState)
    })
  })
})
