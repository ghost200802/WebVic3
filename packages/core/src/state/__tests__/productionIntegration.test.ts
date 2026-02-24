import { rootReducer } from '../reducers'
import { GameState } from '../../models/gameState'
import { Era, BuildingType } from '../../models/baseTypes'
import { tickTime, createBuilding, setWorkers } from '../actions'

describe('Production Integration Tests', () => {
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
          buildings: [],
          storage: new Map(),
          isExplored: false,
          isControlled: false,
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

  describe('Farm Production', () => {
    it('should produce grain when farm has workers', () => {
      let state = initialState
      
      state = rootReducer(state, createBuilding('farm-1', BuildingType.FARM, 'tile-1'))
      state = rootReducer(state, setWorkers('farm-1', 10))
      
      const beforeStorage = state.tiles.get('tile-1')?.storage.get('grain')
      
      state = rootReducer(state, tickTime(1))
      
      const afterStorage = state.tiles.get('tile-1')?.storage.get('grain')
      
      expect(beforeStorage).toBeUndefined()
      expect(afterStorage).toBeDefined()
      expect(afterStorage).toBeGreaterThan(0)
    })

    it('should accumulate grain over multiple ticks', () => {
      let state = initialState
      
      state = rootReducer(state, createBuilding('farm-1', BuildingType.FARM, 'tile-1'))
      state = rootReducer(state, setWorkers('farm-1', 10))
      
      for (let i = 0; i < 5; i++) {
        state = rootReducer(state, tickTime(1))
      }
      
      const storage = state.tiles.get('tile-1')?.storage.get('grain')
      expect(storage).toBeGreaterThan(0)
      expect(storage).toBeGreaterThan(15)
    })

    it('should not produce when farm has no workers', () => {
      let state = initialState
      
      state = rootReducer(state, createBuilding('farm-1', BuildingType.FARM, 'tile-1'))
      state = rootReducer(state, setWorkers('farm-1', 0))
      
      state = rootReducer(state, tickTime(1))
      
      const storage = state.tiles.get('tile-1')?.storage.get('grain')
      expect(storage).toBeUndefined()
    })
  })

  describe('Forestry Production', () => {
    it('should produce wood when forestry has workers', () => {
      let state = initialState
      
      state = rootReducer(state, createBuilding('forestry-1', BuildingType.FORESTRY, 'tile-1'))
      state = rootReducer(state, setWorkers('forestry-1', 10))
      
      state = rootReducer(state, tickTime(1))
      
      const storage = state.tiles.get('tile-1')?.storage.get('wood')
      expect(storage).toBeDefined()
      expect(storage).toBeGreaterThan(0)
    })
  })

  describe('Ranch Production', () => {
    it('should produce food when ranch has workers', () => {
      let state = initialState
      
      state = rootReducer(state, createBuilding('ranch-1', BuildingType.RANCH, 'tile-1'))
      state = rootReducer(state, setWorkers('ranch-1', 8))
      
      state = rootReducer(state, tickTime(1))
      
      const storage = state.tiles.get('tile-1')?.storage.get('food')
      expect(storage).toBeDefined()
      expect(storage).toBeGreaterThan(0)
    })
  })

  describe('Fishery Production', () => {
    it('should produce food when fishery has workers', () => {
      let state = initialState
      
      state = rootReducer(state, createBuilding('fishery-1', BuildingType.FISHERY, 'tile-1'))
      state = rootReducer(state, setWorkers('fishery-1', 5))
      
      state = rootReducer(state, tickTime(1))
      
      const storage = state.tiles.get('tile-1')?.storage.get('food')
      expect(storage).toBeDefined()
      expect(storage).toBeGreaterThan(0)
    })
  })

  describe('Multiple Buildings on Same Tile', () => {
    it('should produce multiple resources from different buildings', () => {
      let state = initialState
      
      state = rootReducer(state, createBuilding('farm-1', BuildingType.FARM, 'tile-1'))
      state = rootReducer(state, setWorkers('farm-1', 10))
      
      state = rootReducer(state, createBuilding('forestry-1', BuildingType.FORESTRY, 'tile-1'))
      state = rootReducer(state, setWorkers('forestry-1', 10))
      
      state = rootReducer(state, tickTime(1))
      
      const tile = state.tiles.get('tile-1')
      const grain = tile?.storage.get('grain')
      const wood = tile?.storage.get('wood')
      
      expect(grain).toBeDefined()
      expect(grain).toBeGreaterThan(0)
      expect(wood).toBeDefined()
      expect(wood).toBeGreaterThan(0)
    })

    it('should accumulate resources from multiple buildings', () => {
      let state = initialState
      
      state = rootReducer(state, createBuilding('farm-1', BuildingType.FARM, 'tile-1'))
      state = rootReducer(state, setWorkers('farm-1', 10))
      
      state = rootReducer(state, createBuilding('forestry-1', BuildingType.FORESTRY, 'tile-1'))
      state = rootReducer(state, setWorkers('forestry-1', 10))
      
      for (let i = 0; i < 10; i++) {
        state = rootReducer(state, tickTime(1))
      }
      
      const tile = state.tiles.get('tile-1')
      const grain = tile?.storage.get('grain')
      const wood = tile?.storage.get('wood')
      
      expect(grain).toBeDefined()
      expect(grain).toBeGreaterThan(30)
      expect(wood).toBeDefined()
      expect(wood).toBeGreaterThan(15)
    })
  })

  describe('Production with Different Worker Levels', () => {
    it('should produce more with more workers', () => {
      let state1 = initialState
      let state2 = initialState
      
      state1 = rootReducer(state1, createBuilding('farm-1', BuildingType.FARM, 'tile-1'))
      state1 = rootReducer(state1, setWorkers('farm-1', 5))
      state1 = rootReducer(state1, tickTime(1))
      
      state2 = rootReducer(state2, createBuilding('farm-2', BuildingType.FARM, 'tile-1'))
      state2 = rootReducer(state2, setWorkers('farm-2', 15))
      state2 = rootReducer(state2, tickTime(1))
      
      const storage1 = state1.tiles.get('tile-1')?.storage.get('grain')
      const storage2 = state2.tiles.get('tile-1')?.storage.get('grain')
      
      expect(storage2).toBeGreaterThan(storage1 || 0)
    })
  })

  describe('Production on Multiple Tiles', () => {
    it('should produce independently on different tiles', () => {
      const stateWithTwoTiles: GameState = {
        ...initialState,
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
            buildings: [],
            storage: new Map(),
            isExplored: false,
            isControlled: false,
            controlCost: 0,
            roadLevel: 0,
            developmentLevel: 0,
            developmentExperience: 0
          }]
        ])
      }
      
      let state = stateWithTwoTiles
      
      state = rootReducer(state, createBuilding('farm-1', BuildingType.FARM, 'tile-1'))
      state = rootReducer(state, setWorkers('farm-1', 10))
      
      state = rootReducer(state, createBuilding('forestry-1', BuildingType.FORESTRY, 'tile-2'))
      state = rootReducer(state, setWorkers('forestry-1', 10))
      
      state = rootReducer(state, tickTime(1))
      
      const tile1 = state.tiles.get('tile-1')
      const tile2 = state.tiles.get('tile-2')
      
      expect(tile1?.storage.get('grain')).toBeDefined()
      expect(tile1?.storage.get('grain')).toBeGreaterThan(0)
      expect(tile2?.storage.get('wood')).toBeDefined()
      expect(tile2?.storage.get('wood')).toBeGreaterThan(0)
    })
  })

  describe('Production State Persistence', () => {
    it('should preserve existing storage when adding new production', () => {
      let state = initialState
      
      state = {
        ...state,
        tiles: new Map([['tile-1', {
          ...state.tiles.get('tile-1')!,
          storage: new Map([['grain', 100]])
        }]])
      }
      
      state = rootReducer(state, createBuilding('farm-1', BuildingType.FARM, 'tile-1'))
      state = rootReducer(state, setWorkers('farm-1', 10))
      
      state = rootReducer(state, tickTime(1))
      
      const storage = state.tiles.get('tile-1')?.storage.get('grain')
      expect(storage).toBeGreaterThan(100)
    })
  })
})
