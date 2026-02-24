import { GameStateProvider, IGameStateProvider, StateListener, createGameStateProvider } from '../gameStateProvider'
import { GameState, createInitialState } from '../../models/gameState'
import { Era } from '../../models/baseTypes'
import { tickTime, setPause, setResume, setTimeMultiplier, createBuilding, upgradeBuilding, removeBuilding, addNotification, removeNotification } from '../actions'
import { BuildingType } from '../../models/baseTypes'

describe('GameStateProvider', () => {
  let provider: IGameStateProvider
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
    provider = createGameStateProvider()
    provider.initialize(initialState)
  })

  describe('getState', () => {
    it('should return current state', () => {
      const state = provider.getState()
      
      expect(state).toBeDefined()
      expect(state.id).toBe('test-game')
      expect(state.name).toBe('Test Game')
    })

    it('should return updated state after dispatch', () => {
      provider.dispatch(setPause())
      
      const state = provider.getState()
      expect(state.isPaused).toBe(true)
    })
  })

  describe('dispatch', () => {
    it('should process tick time action', () => {
      provider.dispatch(tickTime(10))
      
      const state = provider.getState()
      expect(state.tickCount).toBe(1)
    })

    it('should process set pause action', () => {
      provider.dispatch(setPause())
      
      const state = provider.getState()
      expect(state.isPaused).toBe(true)
    })

    it('should process set resume action', () => {
      provider.dispatch(setPause())
      provider.dispatch(setResume())
      
      const state = provider.getState()
      expect(state.isPaused).toBe(false)
    })

    it('should process set time multiplier action', () => {
      provider.dispatch(setTimeMultiplier(5))
      
      const state = provider.getState()
      expect(state.timeMultiplier).toBe(5)
    })

    it('should create building', () => {
      provider.dispatch(createBuilding('building-1', BuildingType.FARM, 'tile-1'))
      
      const state = provider.getState()
      expect(state.buildings.has('building-1')).toBe(true)
    })

    it('should upgrade building', () => {
      provider.dispatch(createBuilding('building-1', BuildingType.FARM, 'tile-1'))
      provider.dispatch(upgradeBuilding('building-1', 2))
      
      const state = provider.getState()
      const building = state.buildings.get('building-1')
      expect(building?.level).toBe(2)
    })

    it('should remove building', () => {
      provider.dispatch(createBuilding('building-1', BuildingType.FARM, 'tile-1'))
      provider.dispatch(removeBuilding('building-1'))
      
      const state = provider.getState()
      expect(state.buildings.has('building-1')).toBe(false)
    })

    it('should add notification', () => {
      provider.dispatch(addNotification('notif-1', 'info', 'Info', 'Test message'))
      
      const state = provider.getState()
      expect(state.notifications).toHaveLength(1)
      expect(state.notifications[0].id).toBe('notif-1')
    })

    it('should remove notification', () => {
      provider.dispatch(addNotification('notif-1', 'info', 'Info', 'Test message'))
      provider.dispatch(removeNotification('notif-1'))
      
      const state = provider.getState()
      expect(state.notifications).toHaveLength(0)
    })
  })

  describe('subscribe', () => {
    it('should register listener and receive state updates', () => {
      const listener = jest.fn()
      provider.subscribe(listener)
      
      provider.dispatch(setPause())
      
      expect(listener).toHaveBeenCalled()
    })

    it('should provide new and previous state to listener', () => {
      const listener = jest.fn()
      provider.subscribe(listener)
      
      provider.dispatch(setPause())
      
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ isPaused: true }),
        expect.objectContaining({ isPaused: false })
      )
    })

    it('should return unsubscribe function', () => {
      const listener = jest.fn()
      const unsubscribe = provider.subscribe(listener)
      
      expect(typeof unsubscribe).toBe('function')
    })

    it('should unsubscribe correctly', () => {
      const listener = jest.fn()
      const unsubscribe = provider.subscribe(listener)
      
      unsubscribe()
      provider.dispatch(setPause())
      
      expect(listener).not.toHaveBeenCalled()
    })

    it('should support multiple listeners', () => {
      const listener1 = jest.fn()
      const listener2 = jest.fn()
      
      provider.subscribe(listener1)
      provider.subscribe(listener2)
      
      provider.dispatch(setPause())
      
      expect(listener1).toHaveBeenCalled()
      expect(listener2).toHaveBeenCalled()
    })

    it('should only notify listeners when state changes', () => {
      const listener = jest.fn()
      provider.subscribe(listener)
      
      const invalidAction: any = { type: 'INVALID_ACTION', payload: {}, timestamp: Date.now() }
      provider.dispatch(invalidAction)
      
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('unsubscribe', () => {
    it('should remove listener', () => {
      const listener = jest.fn()
      provider.subscribe(listener)
      provider.unsubscribe(listener)
      
      provider.dispatch(setPause())
      
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('getPersistedState', () => {
    it('should return persisted state without runtime fields', () => {
      provider.dispatch(setPause())
      provider.dispatch(setTimeMultiplier(5))
      provider.dispatch(addNotification('notif-1', 'info', 'Info', 'Test'))
      
      const persisted = provider.getPersistedState()
      
      expect(persisted.isPaused).toBeUndefined()
      expect(persisted.timeMultiplier).toBeUndefined()
      expect(persisted.notifications).toBeUndefined()
      expect(persisted.researchQueue).toBeUndefined()
      expect(persisted.id).toBe('test-game')
    })
  })

  describe('restorePersistedState', () => {
    it('should restore state from persisted data', () => {
      const persisted = {
        id: 'restored-game',
        name: 'Restored Game',
        version: '1.0.0',
        date: { year: 10, month: 6, day: 15 } as const,
        era: Era.INDUSTRIAL,
        tickCount: 100,
        tiles: new Map(),
        buildings: new Map(),
        populations: new Map(),
        markets: new Map(),
        technologies: new Set(['tech-1']),
        resources: {
          money: 5000,
          goods: new Map([['wood', 100]])
        },
        settings: {
          gameSpeed: 2,
          autoSaveInterval: 600,
          difficulty: 'hard',
          enabledFeatures: {
            events: false,
            disasters: false,
            wars: false,
            trade: false
          }
        }
      }
      
      provider.restorePersistedState(persisted)
      
      const state = provider.getState()
      expect(state.id).toBe('restored-game')
      expect(state.name).toBe('Restored Game')
      expect(state.era).toBe(Era.INDUSTRIAL)
      expect(state.tickCount).toBe(100)
      expect(state.isPaused).toBe(false)
      expect(state.timeMultiplier).toBe(1)
      expect(state.notifications).toEqual([])
    })

    it('should notify listeners on restore', () => {
      const listener = jest.fn()
      provider.subscribe(listener)
      
      const persisted = {
        id: 'restored-game',
        name: 'Restored Game',
        version: '1.0.0',
        date: { year: 10, month: 6, day: 15 } as const,
        era: Era.INDUSTRIAL,
        tickCount: 100,
        tiles: new Map(),
        buildings: new Map(),
        populations: new Map(),
        markets: new Map(),
        technologies: new Set(),
        resources: {
          money: 5000,
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
        }
      }
      
      provider.restorePersistedState(persisted)
      
      expect(listener).toHaveBeenCalled()
    })
  })

  describe('dispatchBatch', () => {
    it('should process multiple actions', () => {
      provider.dispatchBatch([setPause(), setTimeMultiplier(5)])
      
      const state = provider.getState()
      expect(state.isPaused).toBe(true)
      expect(state.timeMultiplier).toBe(5)
    })
  })

  describe('hasPendingActions', () => {
    it('should return false when no pending actions', () => {
      const hasPending = (provider as any).hasPendingActions()
      expect(hasPending).toBe(false)
    })
  })

  describe('getListenerCount', () => {
    it('should return correct listener count', () => {
      const count = (provider as any).getListenerCount()
      expect(count).toBe(0)
      
      provider.subscribe(() => {})
      const countAfter = (provider as any).getListenerCount()
      expect(countAfter).toBe(1)
    })
  })
})
