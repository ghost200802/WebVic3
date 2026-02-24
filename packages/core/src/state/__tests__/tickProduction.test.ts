import { rootReducer } from '../reducers'
import { GameState } from '../../models/gameState'
import { Era } from '../../models/baseTypes'
import { tickTime, createBuilding, setWorkers } from '../actions'
import { BuildingType } from '../../models/baseTypes'

describe('tickProduction', () => {
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
      tiles: new Map([
        ['tile-1', {
          id: 'tile-1',
          name: 'Test Tile',
          terrainComposition: new Map(),
          totalArea: 100,
          buildableArea: 100,
          usedArea: 0,
          resources: [],
          buildings: ['building-1', 'building-2', 'building-3'],
          storage: new Map(),
          isExplored: false,
          isControlled: false,
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
          buildings: ['building-4'],
          storage: new Map(),
          isExplored: false,
          isControlled: false,
          controlCost: 0,
          roadLevel: 0,
          developmentLevel: 0,
          developmentExperience: 0
        }]
      ]),
      buildings: new Map([
        ['building-1', {
          id: 'building-1',
          name: '农田',
          type: BuildingType.FARM,
          minEra: Era.STONE_AGE,
          constructionCost: { wood: 10, stone: 5 },
          constructionTime: 30,
          baseWorkers: 10,
          maxWorkers: 20,
          currentWorkers: 10,
          baseThroughput: 100,
          productionMethods: ['slash_burn'],
          level: 1,
          experience: 0,
          tileId: 'tile-1'
        }],
        ['building-2', {
          id: 'building-2',
          name: '林场',
          type: BuildingType.FORESTRY,
          minEra: Era.STONE_AGE,
          constructionCost: { wood: 5 },
          constructionTime: 20,
          baseWorkers: 10,
          maxWorkers: 20,
          currentWorkers: 10,
          baseThroughput: 80,
          productionMethods: ['gathering'],
          level: 1,
          experience: 0,
          tileId: 'tile-1'
        }],
        ['building-3', {
          id: 'building-3',
          name: '牧场',
          type: BuildingType.RANCH,
          minEra: Era.STONE_AGE,
          constructionCost: { wood: 15 },
          constructionTime: 25,
          baseWorkers: 8,
          maxWorkers: 15,
          currentWorkers: 8,
          baseThroughput: 50,
          productionMethods: ['grazing'],
          level: 1,
          experience: 0,
          tileId: 'tile-1'
        }],
        ['building-4', {
          id: 'building-4',
          name: '渔场',
          type: BuildingType.FISHERY,
          minEra: Era.STONE_AGE,
          constructionCost: { wood: 8 },
          constructionTime: 15,
          baseWorkers: 5,
          maxWorkers: 10,
          currentWorkers: 5,
          baseThroughput: 40,
          productionMethods: ['fishing'],
          level: 1,
          experience: 0,
          tileId: 'tile-2'
        }]
      ]),
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

  describe('Production in tickTimeReducer', () => {
    it('should produce grain for farm with workers', () => {
      const action = tickTime(1)
      const newState = rootReducer(initialState, action)
      
      const tile = newState.tiles.get('tile-1')
      expect(tile?.storage.get('grain')).toBeGreaterThan(0)
    })

    it('should produce wood for forestry with workers', () => {
      const action = tickTime(1)
      const newState = rootReducer(initialState, action)
      
      const tile = newState.tiles.get('tile-1')
      expect(tile?.storage.get('wood')).toBeGreaterThan(0)
    })

    it('should produce food for ranch with workers', () => {
      const action = tickTime(1)
      const newState = rootReducer(initialState, action)
      
      const tile = newState.tiles.get('tile-1')
      expect(tile?.storage.get('food')).toBeGreaterThan(0)
    })

    it('should produce food for fishery with workers', () => {
      const action = tickTime(1)
      const newState = rootReducer(initialState, action)
      
      const tile = newState.tiles.get('tile-2')
      expect(tile?.storage.get('food')).toBeGreaterThan(0)
    })

    it('should not produce for building with zero workers', () => {
      const noWorkersState: GameState = {
        ...initialState,
        buildings: new Map([
          ['building-1', {
            ...initialState.buildings.get('building-1')!,
            currentWorkers: 0
          }]
        ])
      }
      
      const action = tickTime(1)
      const newState = rootReducer(noWorkersState, action)
      
      const tile = newState.tiles.get('tile-1')
      expect(tile?.storage.get('grain')).toBeUndefined()
    })

    it('should accumulate production over multiple ticks', () => {
      let state = initialState
      
      for (let i = 0; i < 5; i++) {
        state = rootReducer(state, tickTime(1))
      }
      
      const tile = state.tiles.get('tile-1')
      expect(tile?.storage.get('grain')).toBeGreaterThan(0)
      expect(tile?.storage.get('wood')).toBeGreaterThan(0)
      expect(tile?.storage.get('food')).toBeGreaterThan(0)
    })

    it('should produce for multiple buildings on same tile', () => {
      const action = tickTime(1)
      const newState = rootReducer(initialState, action)
      
      const tile = newState.tiles.get('tile-1')
      expect(tile?.storage.size).toBeGreaterThan(1)
    })

    it('should produce on different tiles independently', () => {
      const action = tickTime(1)
      const newState = rootReducer(initialState, action)
      
      const tile1 = newState.tiles.get('tile-1')
      const tile2 = newState.tiles.get('tile-2')
      
      expect(tile1?.storage.size).toBeGreaterThan(0)
      expect(tile2?.storage.size).toBeGreaterThan(0)
    })

    it('should increase production when workers are increased', () => {
      let state = initialState
      
      state = rootReducer(state, tickTime(1))
      const firstTile = state.tiles.get('tile-1')
      const firstProduction = firstTile?.storage.get('grain') || 0
      
      state = rootReducer(state, setWorkers('building-1', 20))
      state = rootReducer(state, tickTime(1))
      const secondTile = state.tiles.get('tile-1')
      const secondProduction = (secondTile?.storage.get('grain') || 0) - firstProduction
      
      expect(secondProduction).toBeGreaterThan(firstProduction)
    })

    it('should handle buildings with different production methods', () => {
      const stateWithMethods: GameState = {
        ...initialState,
        buildings: new Map([
          ['building-1', {
            ...initialState.buildings.get('building-1')!,
            productionMethods: ['slash_burn']
          }]
        ])
      }
      
      const action = tickTime(1)
      const newState = rootReducer(stateWithMethods, action)
      
      const tile = newState.tiles.get('tile-1')
      expect(tile?.storage.get('grain')).toBeGreaterThan(0)
    })

    it('should update tick count along with production', () => {
      const action = tickTime(1)
      const newState = rootReducer(initialState, action)
      
      expect(newState.tickCount).toBe(1)
      expect(newState.date.day).toBe(2)
    })

    it('should not break when production method is invalid', () => {
      const stateWithInvalidMethod: GameState = {
        ...initialState,
        buildings: new Map([
          ['building-1', {
            ...initialState.buildings.get('building-1')!,
            productionMethods: ['invalid_method']
          }]
        ])
      }
      
      const action = tickTime(1)
      const newState = rootReducer(stateWithInvalidMethod, action)
      
      expect(newState.tickCount).toBe(1)
      expect(newState.date.day).toBe(2)
    })
  })

  describe('Integration with building management', () => {
    it('should work correctly after creating a new building', () => {
      let state = initialState
      
      state = rootReducer(state, createBuilding('new-building', BuildingType.FARM, 'tile-1'))
      state = rootReducer(state, setWorkers('new-building', 10))
      state = rootReducer(state, tickTime(1))
      
      const tile = state.tiles.get('tile-1')
      expect(tile?.storage.get('grain')).toBeGreaterThan(0)
    })

    it('should stop production after removing building', () => {
      let state = initialState
      
      state = rootReducer(state, tickTime(1))
      const tileBefore = state.tiles.get('tile-1')
      const productionBefore = tileBefore?.storage.get('grain') || 0
      
      state = {
        ...state,
        buildings: new Map(Array.from(state.buildings).filter(([id]) => id !== 'building-1')),
        tiles: new Map(Array.from(state.tiles).map(([id, tile]) => {
          if (id === 'tile-1') {
            return [id, { ...tile, buildings: tile.buildings.filter(b => b !== 'building-1') }]
          }
          return [id, tile]
        }))
      }
      
      state = rootReducer(state, tickTime(1))
      const tileAfter = state.tiles.get('tile-1')
      const productionAfter = tileAfter?.storage.get('grain') || 0
      
      expect(productionAfter).toBe(productionBefore)
    })
  })
})
