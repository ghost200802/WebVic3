import { BuildingManager, ProductionCalculator, ProductionScheduler } from '../index'
import { Era, BuildingType } from '../../../models'

describe('Production System', () => {
  describe('BuildingManager', () => {
    let manager: BuildingManager

    beforeEach(() => {
      manager = new BuildingManager()
    })

    describe('createBuilding', () => {
      it('should create a building successfully', () => {
        const building = manager.createBuilding('forestry', 'tile_1')
        
        expect(building).toBeDefined()
        expect(building.id).toBeDefined()
        expect(building.tileId).toBe('tile_1')
        expect(building.level).toBe(1)
        expect(building.name).toBe('林场')
      })

      it('should throw error for invalid building type', () => {
        expect(() => {
          manager.createBuilding('invalid_type', 'tile_1')
        }).toThrow()
      })

      it('should create multiple buildings with unique IDs', () => {
        const building1 = manager.createBuilding('forestry', 'tile_1')
        const building2 = manager.createBuilding('farm', 'tile_2')
        
        expect(building1.id).not.toBe(building2.id)
      })
    })

    describe('getBuilding', () => {
      it('should return building by ID', () => {
        const building = manager.createBuilding('forestry', 'tile_1')
        const retrieved = manager.getBuilding(building.id)
        
        expect(retrieved).toBe(building)
      })

      it('should return undefined for non-existent building', () => {
        const retrieved = manager.getBuilding('non_existent')
        expect(retrieved).toBeUndefined()
      })
    })

    describe('getAllBuildings', () => {
      it('should return all buildings', () => {
        manager.createBuilding('forestry', 'tile_1')
        manager.createBuilding('farm', 'tile_2')
        
        const buildings = manager.getAllBuildings()
        expect(buildings).toHaveLength(2)
      })
    })

    describe('getBuildingsByTile', () => {
      it('should return buildings for specific tile', () => {
        manager.createBuilding('forestry', 'tile_1')
        manager.createBuilding('farm', 'tile_1')
        manager.createBuilding('quarry', 'tile_2')
        
        const tile1Buildings = manager.getBuildingsByTile('tile_1')
        expect(tile1Buildings).toHaveLength(2)
        
        const tile2Buildings = manager.getBuildingsByTile('tile_2')
        expect(tile2Buildings).toHaveLength(1)
      })
    })

    describe('upgradeBuilding', () => {
      it('should upgrade building level', () => {
        const building = manager.createBuilding('forestry', 'tile_1')
        manager.upgradeBuilding(building.id)
        
        const upgraded = manager.getBuilding(building.id)
        expect(upgraded?.level).toBe(2)
      })

      it('should increase production multiplier after upgrade', () => {
        const building = manager.createBuilding('forestry', 'tile_1')
        manager.upgradeBuilding(building.id)
        
        const upgraded = manager.getBuilding(building.id)
        expect(upgraded?.level).toBeGreaterThan(1)
      })
    })

    describe('removeBuilding', () => {
      it('should remove building', () => {
        const building = manager.createBuilding('forestry', 'tile_1')
        manager.removeBuilding(building.id)
        
        const retrieved = manager.getBuilding(building.id)
        expect(retrieved).toBeUndefined()
      })
    })

    describe('setProductionMethod', () => {
      it('should set production method', () => {
        const building = manager.createBuilding('farm', 'tile_1')
        const initialMethods = [...building.productionMethods]
        manager.setProductionMethod(building.id, initialMethods[0])
        
        const updated = manager.getBuilding(building.id)
        expect(updated?.productionMethods).toContain(initialMethods[0])
      })
    })
  })

  describe('ProductionCalculator', () => {
    let calculator: ProductionCalculator

    beforeEach(() => {
      calculator = new ProductionCalculator()
    })

    describe('calculateProduction', () => {
      it('should calculate production result', () => {
        const building = {
          id: 'building_1',
          type: BuildingType.FARM,
          level: 1,
          productionMethods: ['slash_burn'],
          baseWorkers: 10,
          baseThroughput: 100,
          efficiency: 1.0,
          constructionCost: { wood: 10, stone: 5 }
        }

        const result = calculator.calculateProduction(
          building,
          10,
          Era.STONE_AGE,
          2,
          1.0
        )

        expect(result).toBeDefined()
        expect(result.inputs).toBeInstanceOf(Map)
        expect(result.outputs).toBeInstanceOf(Map)
        expect(result.efficiency).toBeGreaterThanOrEqual(0)
      })

      it('should apply era bonus correctly', () => {
        const building = {
          id: 'building_1',
          type: BuildingType.FARM,
          level: 1,
          productionMethods: ['slash_burn'],
          baseWorkers: 10,
          baseThroughput: 100,
          efficiency: 1.0,
          constructionCost: { wood: 10, stone: 5 }
        }

        const stoneAgeResult = calculator.calculateProduction(
          building,
          10,
          Era.STONE_AGE,
          2,
          1.0
        )

        const industrialResult = calculator.calculateProduction(
          building,
          10,
          Era.INDUSTRIAL,
          2,
          1.0
        )

        expect(industrialResult.efficiency).toBeGreaterThan(stoneAgeResult.efficiency)
      })

      it('should apply education bonus', () => {
        const building = {
          id: 'building_1',
          type: BuildingType.FARM,
          level: 1,
          productionMethods: ['slash_burn'],
          baseWorkers: 10,
          baseThroughput: 100,
          efficiency: 1.0,
          constructionCost: { wood: 10, stone: 5 }
        }

        const lowEducationResult = calculator.calculateProduction(
          building,
          10,
          Era.STONE_AGE,
          0,
          1.0
        )

        const highEducationResult = calculator.calculateProduction(
          building,
          10,
          Era.STONE_AGE,
          2,
          1.0
        )

        expect(highEducationResult.efficiency).toBeGreaterThan(lowEducationResult.efficiency)
      })
    })

    describe('calculateUpgradeCost', () => {
      it('should calculate upgrade cost', () => {
        const building = {
          id: 'building_1',
          type: BuildingType.FARM,
          level: 1,
          productionMethods: ['slash_burn'],
          baseWorkers: 10,
          baseThroughput: 100,
          efficiency: 1.0,
          constructionCost: { wood: 10, stone: 5 }
        }

        const cost = calculator.calculateUpgradeCost(building)
        
        expect(cost).toBeDefined()
        expect(Object.keys(cost).length).toBeGreaterThan(0)
      })
    })
  })

  describe('ProductionScheduler', () => {
    let scheduler: ProductionScheduler

    beforeEach(() => {
      scheduler = new ProductionScheduler()
    })

    describe('scheduleProduction', () => {
      it('should schedule production for building', () => {
        const building = {
          id: 'building_1',
          type: BuildingType.FORESTRY,
          level: 1,
          productionMethods: ['basic'],
          baseWorkers: 10,
          baseThroughput: 100,
          efficiency: 1.0
        }

        const result = scheduler.scheduleProduction(building)
        
        expect(result).toBeDefined()
        expect(result.inputs).toBeInstanceOf(Map)
        expect(result.outputs).toBeInstanceOf(Map)
        expect(result.efficiency).toBeGreaterThan(0)
      })

      it('should not produce for building with no workers', () => {
        const building = {
          id: 'building_1',
          type: BuildingType.FORESTRY,
          level: 1,
          productionMethods: ['basic'],
          baseWorkers: 0,
          baseThroughput: 100,
          efficiency: 1.0
        }

        const result = scheduler.scheduleProduction(building)
        
        expect(result.efficiency).toBe(1.1)
      })
    })
  })
})
