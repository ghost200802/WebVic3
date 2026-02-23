import { PopulationManager } from '../index'
import { EmploymentStatus } from '../../../models'

describe('Population System', () => {
  let manager: PopulationManager

  beforeEach(() => {
    manager = new PopulationManager()
  })

  describe('createPopulation', () => {
    it('should create population successfully', () => {
      const population = manager.createPopulation('tile_1', 100)
      
      expect(population).toBeDefined()
      expect(population.id).toBeDefined()
      expect(population.tileId).toBe('tile_1')
      expect(population.totalPopulation).toBe(100)
      expect(population.groups.length).toBeGreaterThan(0)
    })

    it('should distribute population across age groups', () => {
      const population = manager.createPopulation('tile_1', 100)
      
      expect(population.ageDistribution.adults).toBeGreaterThan(0)
      expect(population.ageDistribution.children).toBeGreaterThan(0)
      expect(population.ageDistribution.elders).toBeGreaterThan(0)
    })

    it('should calculate initial employment', () => {
      const population = manager.createPopulation('tile_1', 100)
      
      expect(population.employment.total).toBe(100)
      expect(population.employment.unemployed).toBe(100)
      expect(population.employment.employed).toBe(0)
    })
  })

  describe('addPopulation', () => {
    it('should add population to existing group', () => {
      const population = manager.createPopulation('tile_1', 100)
      const initialTotal = population.totalPopulation
      
      manager.addPopulation(population.id, 50)
      
      const updated = manager.getPopulation(population.id)
      expect(updated?.totalPopulation).toBe(initialTotal + 50)
    })

    it('should update distributions after adding', () => {
      const population = manager.createPopulation('tile_1', 100)
      
      manager.addPopulation(population.id, 50)
      
      const updated = manager.getPopulation(population.id)
      expect(updated?.ageDistribution.adults).toBeGreaterThan(0)
    })
  })

  describe('removePopulation', () => {
    it('should remove population', () => {
      const population = manager.createPopulation('tile_1', 100)
      
      manager.removePopulation(population.id, 30)
      
      const updated = manager.getPopulation(population.id)
      expect(updated?.totalPopulation).toBe(70)
    })

    it('should delete population if all removed', () => {
      const population = manager.createPopulation('tile_1', 100)
      
      manager.removePopulation(population.id, 100)
      
      const updated = manager.getPopulation(population.id)
      expect(updated).toBeUndefined()
    })
  })

  describe('getPopulation', () => {
    it('should return population by ID', () => {
      const population = manager.createPopulation('tile_1', 100)
      const retrieved = manager.getPopulation(population.id)
      
      expect(retrieved).toBe(population)
    })

    it('should return undefined for non-existent population', () => {
      const retrieved = manager.getPopulation('non_existent')
      expect(retrieved).toBeUndefined()
    })
  })

  describe('employPopulation', () => {
    it('should employ population', () => {
      const population = manager.createPopulation('tile_1', 100)
      
      manager.employPopulation(population.id, 'building_1', 20)
      
      const updated = manager.getPopulation(population.id)
      expect(updated?.employment.employed).toBe(20)
      expect(updated?.employment.unemployed).toBe(80)
    })

    it('should update group employment status', () => {
      const population = manager.createPopulation('tile_1', 100)
      
      manager.employPopulation(population.id, 'building_1', 10)
      
      const updated = manager.getPopulation(population.id)
      const employedGroups = updated?.groups.filter(g => g.employment === EmploymentStatus.EMPLOYED)
      expect(employedGroups?.length).toBeGreaterThan(0)
    })
  })

  describe('unemployPopulation', () => {
    it('should unemploy population', () => {
      const population = manager.createPopulation('tile_1', 100)
      manager.employPopulation(population.id, 'building_1', 20)
      
      manager.unemployPopulation(population.id, 10)
      
      const updated = manager.getPopulation(population.id)
      expect(updated?.employment.employed).toBe(10)
      expect(updated?.employment.unemployed).toBe(90)
    })

    it('should update group employment status', () => {
      const population = manager.createPopulation('tile_1', 100)
      manager.employPopulation(population.id, 'building_1', 10)
      
      manager.unemployPopulation(population.id, 5)
      
      const updated = manager.getPopulation(population.id)
      const unemployedGroups = updated?.groups.filter(g => g.employment === EmploymentStatus.UNEMPLOYED)
      expect(unemployedGroups?.length).toBeGreaterThan(0)
    })
  })

  describe('updateNeeds', () => {
    it('should update needs for all groups', () => {
      const population = manager.createPopulation('tile_1', 100)
      
      manager.updateNeeds(population.id)
      
      const updated = manager.getPopulation(population.id)
      const groupsWithNeeds = updated?.groups.filter(g => 
        g.needs.survival > 0 || g.needs.basic > 0
      )
      expect(groupsWithNeeds?.length).toBeGreaterThan(0)
    })

    it('should calculate living standard', () => {
      const population = manager.createPopulation('tile_1', 100)
      
      manager.updateNeeds(population.id)
      
      const updated = manager.getPopulation(population.id)
      expect(updated?.averageLivingStandard).toBeGreaterThan(0)
    })
  })

  describe('calculateGrowth', () => {
    it('should calculate natural growth', () => {
      const population = manager.createPopulation('tile_1', 100)
      population.birthRate = 0.03
      population.deathRate = 0.02
      
      const growth = manager.calculateGrowth(population.id)
      
      expect(growth).toBe(1)
    })

    it('should include migration in growth', () => {
      const population = manager.createPopulation('tile_1', 100)
      population.birthRate = 0.03
      population.deathRate = 0.02
      population.netMigration = 5
      
      const growth = manager.calculateGrowth(population.id)
      
      expect(growth).toBe(6)
    })

    it('should return 0 for non-existent population', () => {
      const growth = manager.calculateGrowth('non_existent')
      expect(growth).toBe(0)
    })
  })
})
