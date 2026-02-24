import { GameState, createInitialState, cloneGameState } from '../../models/gameState'
import { Era } from '../../models/baseTypes'

describe('GameState', () => {
  describe('createInitialState', () => {
    it('should create initial state with correct defaults', () => {
      const initialState = createInitialState()
      
      expect(initialState).toBeDefined()
      expect(initialState.date).toEqual({ year: 1, month: 1, day: 1 })
      expect(initialState.era).toBe(Era.STONE_AGE)
      expect(initialState.tickCount).toBe(0)
      expect(initialState.isPaused).toBe(false)
      expect(initialState.timeMultiplier).toBe(1)
      expect(initialState.tiles).toBeInstanceOf(Map)
      expect(initialState.buildings).toBeInstanceOf(Map)
      expect(initialState.populations).toBeInstanceOf(Map)
      expect(initialState.markets).toBeInstanceOf(Map)
      expect(initialState.technologies).toBeInstanceOf(Set)
      expect(initialState.notifications).toEqual([])
      expect(initialState.resources.money).toBe(1000)
    })
  })

  describe('cloneGameState', () => {
    it('should create a deep clone of game state', () => {
      const originalState: GameState = {
        id: 'test-id',
        name: 'Test Game',
        version: '1.0.0',
        date: { year: 100, month: 6, day: 15 },
        era: Era.INDUSTRIAL,
        tickCount: 500,
        isPaused: false,
        timeMultiplier: 2,
        tiles: new Map([['tile-1', { id: 'tile-1', type: 'plains' as any, coordinates: { x: 0, y: 0 } }]]),
        buildings: new Map([['building-1', { id: 'building-1', name: 'Factory', type: 'factory' as any, minEra: Era.INDUSTRIAL, constructionCost: {}, constructionTime: 100, baseWorkers: 50, maxWorkers: 100, currentWorkers: 0, baseThroughput: 200, productionMethods: [], level: 1, experience: 0, tileId: 'tile-1' }]]),
        populations: new Map(),
        markets: new Map(),
        technologies: new Set(['tech-1', 'tech-2']),
        researchQueue: {
          current: { tech: 'tech-3', progress: 50, estimatedCompletion: { year: 101, month: 6, day: 15 } },
          queue: ['tech-4'],
          researchSpeed: 1
        },
        resources: {
          money: 5000,
          goods: new Map([['wood', 100], ['steel', 50]])
        },
        globalStorage: new Map([['food', 100], ['wood', 200]]),
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
        notifications: [
          { id: 'notif-1', type: 'info', title: 'Info', message: 'Test message', timestamp: 12345 }
        ]
      }

      const clonedState = cloneGameState(originalState)

      expect(clonedState).toEqual(originalState)
      expect(clonedState).not.toBe(originalState)
      expect(clonedState.date).not.toBe(originalState.date)
      expect(clonedState.tiles).not.toBe(originalState.tiles)
      expect(clonedState.buildings).not.toBe(originalState.buildings)
      expect(clonedState.populations).not.toBe(originalState.populations)
      expect(clonedState.markets).not.toBe(originalState.markets)
      expect(clonedState.technologies).not.toBe(originalState.technologies)
      expect(clonedState.researchQueue).not.toBe(originalState.researchQueue)
      expect(clonedState.resources.goods).not.toBe(originalState.resources.goods)
      expect(clonedState.settings.enabledFeatures).not.toBe(originalState.settings.enabledFeatures)
      expect(clonedState.notifications).not.toBe(originalState.notifications)
    })

    it('should maintain immutability of cloned state', () => {
      const originalState: GameState = {
        id: 'test-id',
        name: 'Test Game',
        version: '1.0.0',
        date: { year: 1, month: 1, day: 1 },
        era: Era.STONE_AGE,
        tickCount: 0,
        isPaused: false,
        timeMultiplier: 1,
        tiles: new Map(),
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

      const clonedState = cloneGameState(originalState)

      clonedState.date.year = 10
      clonedState.resources.money = 9999
      clonedState.notifications.push({ id: 'new', type: 'info', title: 'New', message: 'New', timestamp: 0 })

      expect(originalState.date.year).toBe(1)
      expect(originalState.resources.money).toBe(1000)
      expect(originalState.notifications).toHaveLength(0)
    })
  })

  describe('GameState interface', () => {
    it('should allow creating a valid GameState object', () => {
      const gameState: GameState = {
        id: 'game-1',
        name: 'My Game',
        version: '1.0.0',
        date: { year: 1, month: 1, day: 1 },
        era: Era.STONE_AGE,
        tickCount: 0,
        isPaused: false,
        timeMultiplier: 1,
        tiles: new Map(),
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

      expect(gameState.id).toBe('game-1')
      expect(gameState.name).toBe('My Game')
      expect(gameState.isPaused).toBe(false)
      expect(gameState.timeMultiplier).toBe(1)
      expect(gameState.notifications).toEqual([])
    })

    it('should support paused state', () => {
      const initialState = createInitialState()
      
      expect(initialState.isPaused).toBe(false)
      
      const pausedState: GameState = {
        ...initialState,
        id: 'test',
        name: 'test',
        version: '1.0.0',
        isPaused: true
      }
      
      expect(pausedState.isPaused).toBe(true)
    })

    it('should support time multiplier', () => {
      const initialState = createInitialState()
      
      expect(initialState.timeMultiplier).toBe(1)
      
      const fastState: GameState = {
        ...initialState,
        id: 'test',
        name: 'test',
        version: '1.0.0',
        timeMultiplier: 5
      }
      
      expect(fastState.timeMultiplier).toBe(5)
    })

    it('should support notifications', () => {
      const initialState = createInitialState()
      
      expect(initialState.notifications).toEqual([])
      
      const stateWithNotification: GameState = {
        ...initialState,
        id: 'test',
        name: 'test',
        version: '1.0.0',
        notifications: [
          { id: '1', type: 'info', title: 'Info', message: 'Message', timestamp: Date.now() },
          { id: '2', type: 'warning', title: 'Warning', message: 'Warning message', timestamp: Date.now() }
        ]
      }
      
      expect(stateWithNotification.notifications).toHaveLength(2)
      expect(stateWithNotification.notifications[0].type).toBe('info')
      expect(stateWithNotification.notifications[1].type).toBe('warning')
    })
  })
})
