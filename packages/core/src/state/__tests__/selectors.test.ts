import { GameState } from '../../models/gameState'
import { Era } from '../../models/baseTypes'
import {
  selectTotalPopulation,
  selectEmployedPopulation,
  selectUnemployedPopulation,
  selectEmploymentRate,
  selectTotalBuildings,
  selectBuildingsByType,
  selectBuildingWorkers,
  selectTotalWorkers,
  selectAverageWage,
  selectAverageLivingStandard,
  selectTotalMoney,
  selectGoodsCount,
  selectAllGoods,
  selectMarketPrice,
  selectMarketSupply,
  selectMarketDemand,
  selectResearchedTechs,
  selectIsTechResearched,
  selectResearchProgress,
  selectTotalPopulationByAge,
  selectPopulationBySocialClass,
  selectNotificationsByType,
  selectRecentNotifications,
  selectBuildingEfficiency,
  selectProductionCapacity,
  selectGameProgress
} from '../selectors'
import { BuildingType } from '../../models/baseTypes'

describe('Selectors', () => {
  let initialState: GameState

  beforeEach(() => {
    initialState = {
      id: 'test-game',
      name: 'Test Game',
      version: '1.0.0',
      date: { year: 100, month: 6, day: 15 },
      era: Era.INDUSTRIAL,
      tickCount: 500,
      isPaused: false,
      timeMultiplier: 2,
      tiles: new Map([['tile-1', { id: 'tile-1', type: 'plains' as any, coordinates: { x: 0, y: 0 } }]]),
      buildings: new Map([
        ['building-1', { id: 'building-1', name: 'Farm', type: BuildingType.FARM, minEra: Era.STONE_AGE, constructionCost: {}, constructionTime: 30, baseWorkers: 10, maxWorkers: 20, baseThroughput: 100, productionMethods: [], level: 2, experience: 50, tileId: 'tile-1' }],
        ['building-2', { id: 'building-2', name: 'Factory', type: BuildingType.FACTORY, minEra: Era.INDUSTRIAL, constructionCost: {}, constructionTime: 100, baseWorkers: 50, maxWorkers: 100, baseThroughput: 200, productionMethods: [], level: 1, experience: 0, tileId: 'tile-1' }]
      ]),
      populations: new Map([
        ['pop-1', { id: 'pop-1', tileId: 'tile-1', totalPopulation: 1000, groups: [
          { id: 'group-1', size: 400, ageGroup: 'adult' as any, education: 'basic' as any, socialClass: 'worker' as any, employment: 'employed' as any, workplace: 'building-1', profession: 'farmer', wage: 15, wealth: 200, livingStandard: 60, needs: { survival: 100, basic: 80, improved: 50, luxury: 20 } },
          { id: 'group-2', size: 200, ageGroup: 'adult' as any, education: 'basic' as any, socialClass: 'worker' as any, employment: 'unemployed' as any, wage: 0, wealth: 100, livingStandard: 40, needs: { survival: 100, basic: 80, improved: 50, luxury: 20 } },
          { id: 'group-3', size: 50, ageGroup: 'adult' as any, education: 'basic' as any, socialClass: 'worker' as any, employment: 'retired' as any, wage: 10, wealth: 300, livingStandard: 70, needs: { survival: 100, basic: 80, improved: 50, luxury: 20 } }
        ], ageDistribution: { children: 250, adults: 700, elders: 50 }, educationDistribution: {} as any, classDistribution: {} as any, employment: { total: 1000, employed: 400, unemployed: 600, retired: 0 }, averageWage: 12, averageLivingStandard: 55, birthRate: 0.02, deathRate: 0.01, netMigration: 0 }],
        ['pop-2', { id: 'pop-2', tileId: 'tile-1', totalPopulation: 500, groups: [], ageDistribution: { children: 100, adults: 350, elders: 50 }, educationDistribution: {} as any, classDistribution: {} as any, employment: { total: 500, employed: 300, unemployed: 200, retired: 0 }, averageWage: 18, averageLivingStandard: 65, birthRate: 0.02, deathRate: 0.01, netMigration: 0 }]
      ]),
      markets: new Map([
        ['market-1', { id: 'market-1', name: 'Market 1', regions: ['region-1'], prices: new Map([['wood', { basePrice: 10, currentPrice: 15, previousPrice: 12, history: [] }]]), supply: new Map([['wood', 100]]), demand: new Map([['wood', 80]]), stockpile: new Map(), events: [] }]
      ]),
      technologies: new Set(['tech-1', 'tech-2', 'tech-3']),
      researchQueue: {
        current: { tech: 'tech-4', progress: 50, estimatedCompletion: { year: 101, month: 6, day: 15 } },
        queue: ['tech-5', 'tech-6'],
        researchSpeed: 1.5
      },
      resources: {
        money: 10000,
        goods: new Map([['wood', 500], ['steel', 200], ['food', 1000]])
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
      notifications: [
        { id: 'notif-1', type: 'info', title: 'Info', message: 'Test message 1', timestamp: 1000 },
        { id: 'notif-2', type: 'warning', title: 'Warning', message: 'Test message 2', timestamp: 2000 },
        { id: 'notif-3', type: 'error', title: 'Error', message: 'Test message 3', timestamp: 3000 }
      ]
    }
  })

  describe('selectTotalPopulation', () => {
    it('should return total population across all populations', () => {
      const total = selectTotalPopulation(initialState)
      expect(total).toBe(1500)
    })

    it('should return 0 when no populations', () => {
      const state: any = { ...initialState, populations: new Map() }
      const total = selectTotalPopulation(state)
      expect(total).toBe(0)
    })
  })

  describe('selectEmployedPopulation', () => {
    it('should return total employed population', () => {
      const employed = selectEmployedPopulation(initialState)
      expect(employed).toBe(700)
    })
  })

  describe('selectUnemployedPopulation', () => {
    it('should return total unemployed population', () => {
      const unemployed = selectUnemployedPopulation(initialState)
      expect(unemployed).toBe(800)
    })
  })

  describe('selectEmploymentRate', () => {
    it('should calculate employment rate as percentage', () => {
      const rate = selectEmploymentRate(initialState)
      expect(rate).toBeCloseTo(46.67, 1)
    })

    it('should return 0 when no population', () => {
      const state: any = { ...initialState, populations: new Map() }
      const rate = selectEmploymentRate(state)
      expect(rate).toBe(0)
    })
  })

  describe('selectTotalBuildings', () => {
    it('should return total number of buildings', () => {
      const total = selectTotalBuildings(initialState)
      expect(total).toBe(2)
    })

    it('should return 0 when no buildings', () => {
      const state: any = { ...initialState, buildings: new Map() }
      const total = selectTotalBuildings(state)
      expect(total).toBe(0)
    })
  })

  describe('selectBuildingsByType', () => {
    it('should return count of buildings by type', () => {
      const farmCount = selectBuildingsByType(initialState, BuildingType.FARM)
      expect(farmCount).toBe(1)

      const factoryCount = selectBuildingsByType(initialState, BuildingType.FACTORY)
      expect(factoryCount).toBe(1)

      const workshopCount = selectBuildingsByType(initialState, BuildingType.WORKSHOP)
      expect(workshopCount).toBe(0)
    })
  })

  describe('selectBuildingWorkers', () => {
    it('should return number of workers assigned to building', () => {
      const workers = selectBuildingWorkers(initialState, 'building-1')
      expect(workers).toBe(400)
    })

    it('should return 0 for non-existent building', () => {
      const workers = selectBuildingWorkers(initialState, 'non-existent')
      expect(workers).toBe(0)
    })
  })

  describe('selectTotalWorkers', () => {
    it('should return total number of workers across all buildings', () => {
      const workers = selectTotalWorkers(initialState)
      expect(workers).toBe(400)
    })
  })

  describe('selectAverageWage', () => {
    it('should calculate average wage across all populations', () => {
      const avgWage = selectAverageWage(initialState)
      expect(avgWage).toBeCloseTo(14, 0)
    })

    it('should return 0 when no populations', () => {
      const state: any = { ...initialState, populations: new Map() }
      const avgWage = selectAverageWage(state)
      expect(avgWage).toBe(0)
    })
  })

  describe('selectAverageLivingStandard', () => {
    it('should calculate average living standard', () => {
      const avgStandard = selectAverageLivingStandard(initialState)
      expect(avgStandard).toBeCloseTo(58.33, 1)
    })

    it('should return 0 when no populations', () => {
      const state: any = { ...initialState, populations: new Map() }
      const avgStandard = selectAverageLivingStandard(state)
      expect(avgStandard).toBe(0)
    })
  })

  describe('selectTotalMoney', () => {
    it('should return total money', () => {
      const money = selectTotalMoney(initialState)
      expect(money).toBe(10000)
    })
  })

  describe('selectGoodsCount', () => {
    it('should return count of specific goods', () => {
      const wood = selectGoodsCount(initialState, 'wood')
      expect(wood).toBe(500)

      const steel = selectGoodsCount(initialState, 'steel')
      expect(steel).toBe(200)

      const nonExistent = selectGoodsCount(initialState, 'non-existent')
      expect(nonExistent).toBe(0)
    })
  })

  describe('selectAllGoods', () => {
    it('should return all goods as a map', () => {
      const goods = selectAllGoods(initialState)
      
      expect(goods.get('wood')).toBe(500)
      expect(goods.get('steel')).toBe(200)
      expect(goods.get('food')).toBe(1000)
      expect(goods.size).toBe(3)
    })

    it('should return empty map when no goods', () => {
      const state: any = { ...initialState, resources: { money: 1000, goods: new Map() } }
      const goods = selectAllGoods(state)
      expect(goods.size).toBe(0)
    })
  })

  describe('selectMarketPrice', () => {
    it('should return current price of goods in market', () => {
      const price = selectMarketPrice(initialState, 'market-1', 'wood')
      expect(price).toBe(15)
    })

    it('should return 0 for non-existent market', () => {
      const price = selectMarketPrice(initialState, 'non-existent', 'wood')
      expect(price).toBe(0)
    })

    it('should return 0 for non-existent goods', () => {
      const price = selectMarketPrice(initialState, 'market-1', 'non-existent')
      expect(price).toBe(0)
    })
  })

  describe('selectMarketSupply', () => {
    it('should return supply of goods in market', () => {
      const supply = selectMarketSupply(initialState, 'market-1', 'wood')
      expect(supply).toBe(100)
    })

    it('should return 0 for non-existent market', () => {
      const supply = selectMarketSupply(initialState, 'non-existent', 'wood')
      expect(supply).toBe(0)
    })
  })

  describe('selectMarketDemand', () => {
    it('should return demand of goods in market', () => {
      const demand = selectMarketDemand(initialState, 'market-1', 'wood')
      expect(demand).toBe(80)
    })

    it('should return 0 for non-existent market', () => {
      const demand = selectMarketDemand(initialState, 'non-existent', 'wood')
      expect(demand).toBe(0)
    })
  })

  describe('selectResearchedTechs', () => {
    it('should return array of researched techs', () => {
      const techs = selectResearchedTechs(initialState)
      expect(techs).toContain('tech-1')
      expect(techs).toContain('tech-2')
      expect(techs).toContain('tech-3')
      expect(techs.length).toBe(3)
    })
  })

  describe('selectIsTechResearched', () => {
    it('should return true for researched tech', () => {
      const researched = selectIsTechResearched(initialState, 'tech-1')
      expect(researched).toBe(true)
    })

    it('should return false for non-researched tech', () => {
      const researched = selectIsTechResearched(initialState, 'tech-4')
      expect(researched).toBe(false)
    })
  })

  describe('selectResearchProgress', () => {
    it('should return research progress info', () => {
      const progress = selectResearchProgress(initialState)
      
      expect(progress.current).toBe('tech-4')
      expect(progress.progress).toBe(50)
      expect(progress.queue).toContain('tech-5')
      expect(progress.queue).toContain('tech-6')
    })

    it('should handle no current research', () => {
      const state: any = { ...initialState, researchQueue: { current: null, queue: [], researchSpeed: 1 } }
      const progress = selectResearchProgress(state)
      
      expect(progress.current).toBe(null)
      expect(progress.progress).toBe(0)
      expect(progress.queue).toEqual([])
    })
  })

  describe('selectTotalPopulationByAge', () => {
    it('should return population distribution by age', () => {
      const distribution = selectTotalPopulationByAge(initialState)
      
      expect(distribution.children).toBe(350)
      expect(distribution.adults).toBe(1050)
      expect(distribution.elders).toBe(100)
    })

    it('should return zeros when no populations', () => {
      const state: any = { ...initialState, populations: new Map() }
      const distribution = selectTotalPopulationByAge(state)
      
      expect(distribution.children).toBe(0)
      expect(distribution.adults).toBe(0)
      expect(distribution.elders).toBe(0)
    })
  })

  describe('selectPopulationBySocialClass', () => {
    it('should return population by social class', () => {
      const distribution = selectPopulationBySocialClass(initialState)
      
      expect(distribution).toBeDefined()
      expect(typeof distribution).toBe('object')
    })
  })

  describe('selectNotificationsByType', () => {
    it('should return count of notifications by type', () => {
      const infoCount = selectNotificationsByType(initialState, 'info')
      expect(infoCount).toBe(1)

      const warningCount = selectNotificationsByType(initialState, 'warning')
      expect(warningCount).toBe(1)

      const errorCount = selectNotificationsByType(initialState, 'error')
      expect(errorCount).toBe(1)

      const successCount = selectNotificationsByType(initialState, 'success')
      expect(successCount).toBe(0)
    })
  })

  describe('selectRecentNotifications', () => {
    it('should return recent notifications in reverse order', () => {
      const recent = selectRecentNotifications(initialState, 2)
      
      expect(recent.length).toBe(2)
      expect(recent[0].id).toBe('notif-3')
      expect(recent[1].id).toBe('notif-2')
    })

    it('should limit results to specified count', () => {
      const recent = selectRecentNotifications(initialState, 1)
      expect(recent.length).toBe(1)
    })

    it('should return all notifications when limit exceeds count', () => {
      const recent = selectRecentNotifications(initialState, 10)
      expect(recent.length).toBe(3)
    })

    it('should use default limit of 10', () => {
      const recent = selectRecentNotifications(initialState)
      expect(recent.length).toBe(3)
    })
  })

  describe('selectBuildingEfficiency', () => {
    it('should calculate building efficiency based on workers and level', () => {
      const efficiency = selectBuildingEfficiency(initialState, 'building-1')
      expect(efficiency).toBe(2)
    })

    it('should return 0 for non-existent building', () => {
      const efficiency = selectBuildingEfficiency(initialState, 'non-existent')
      expect(efficiency).toBe(0)
    })

    it('should return 0 when no workers', () => {
      const efficiency = selectBuildingEfficiency(initialState, 'building-2')
      expect(efficiency).toBe(0)
    })
  })

  describe('selectProductionCapacity', () => {
    it('should return production capacity for all buildings', () => {
      const capacity = selectProductionCapacity(initialState)
      
      expect(capacity.get('building-1')).toBe(200)
      expect(capacity.get('building-2')).toBe(0)
    })

    it('should return empty map when no buildings', () => {
      const state: any = { ...initialState, buildings: new Map() }
      const capacity = selectProductionCapacity(state)
      expect(capacity.size).toBe(0)
    })
  })

  describe('selectGameProgress', () => {
    it('should return game progress info', () => {
      const progress = selectGameProgress(initialState)
      
      expect(progress.era).toBe(Era.INDUSTRIAL)
      expect(progress.year).toBe(100)
      expect(progress.totalDays).toBeGreaterThan(36500)
    })
  })
})
