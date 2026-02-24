import { defineStore } from 'pinia'
import { Era, BuildingType, AgeGroup, EducationLevel, SocialClass, EmploymentStatus } from '@webvic3/core'
import type { GameState, GameDate, Building, Population, PopulationGroup } from '@webvic3/core'

interface GameAlert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: number
}

interface ExtendedBuilding extends Building {
  efficiency: number
  workers: number
  count: number
}

interface ExtendedPopulation extends Population {
  name: string
  employedPopulation: number
  unemployedPopulation: number
  wage: number
  growthRate: number
  standardOfLiving: string
}

export const useGameStore = defineStore('game', {
  state: () => ({
    gameState: null as GameState | null,
    isPaused: false,
    alerts: [] as GameAlert[],
    tickInterval: null as number | null,
    buildings: [] as ExtendedBuilding[],
    populations: [] as ExtendedPopulation[]
  }),

  getters: {
    gameDate(): GameDate | null {
      return this.gameState?.date || null
    },

    era(): Era | null {
      return this.gameState?.era || null
    },

    population(): number {
      return this.populations.reduce((sum, pop) => sum + pop.totalPopulation, 0)
    },

    treasury(): number {
      return this.gameState?.resources.money || 0
    },

    employedPopulation(): number {
      return this.buildings.reduce((sum, building) => sum + building.workers, 0)
    }
  },

  actions: {
    initializeGame() {
      this.gameState = {
        id: 'game_1',
        name: '新游戏',
        version: '1.0.0',
        date: { year: 1, month: 1, day: 1 },
        era: Era.STONE_AGE,
        tickCount: 0,
        tiles: new Map(),
        buildings: new Map(),
        populations: new Map(),
        markets: new Map(),
        technologies: new Set(['stone_tool']),
        researchQueue: {
          current: { tech: 'domestication', progress: 0, estimatedCompletion: { year: 1, month: 2, day: 1 } },
          queue: ['metal_smelting'],
          researchSpeed: 1.0
        },
        resources: {
          money: 1000,
          goods: new Map([
            ['food', 500],
            ['wood', 300],
            ['stone', 200]
          ])
        },
        settings: {
          gameSpeed: 1,
          autoSaveInterval: 5,
          difficulty: 'normal',
          enabledFeatures: {
            events: true,
            disasters: true,
            wars: false,
            trade: true
          }
        }
      }

      this.buildings = []

      const farmerGroup: PopulationGroup = {
        id: 'group_farmers',
        size: 1200,
        ageGroup: AgeGroup.ADULT,
        education: EducationLevel.BASIC,
        socialClass: SocialClass.WORKER,
        employment: EmploymentStatus.EMPLOYED,
        wage: 8,
        wealth: 100,
        livingStandard: 3,
        needs: { survival: 50, basic: 30, improved: 15, luxury: 5 }
      }

      const workerGroup: PopulationGroup = {
        id: 'group_workers',
        size: 800,
        ageGroup: AgeGroup.ADULT,
        education: EducationLevel.PRIMARY,
        socialClass: SocialClass.WORKER,
        employment: EmploymentStatus.EMPLOYED,
        wage: 12,
        wealth: 150,
        livingStandard: 4,
        needs: { survival: 50, basic: 30, improved: 15, luxury: 5 }
      }

      const merchantGroup: PopulationGroup = {
        id: 'group_merchants',
        size: 200,
        ageGroup: AgeGroup.ADULT,
        education: EducationLevel.SECONDARY,
        socialClass: SocialClass.MIDDLE,
        employment: EmploymentStatus.EMPLOYED,
        wage: 25,
        wealth: 300,
        livingStandard: 5,
        needs: { survival: 50, basic: 30, improved: 15, luxury: 5 }
      }

      this.populations = [
        {
          id: 'pop_farmers',
          tileId: 'tile_1',
          totalPopulation: 1200,
          groups: [farmerGroup],
          ageDistribution: { children: 300, adults: 800, elders: 100 },
          educationDistribution: {
            [EducationLevel.ILLITERATE]: 200,
            [EducationLevel.BASIC]: 800,
            [EducationLevel.PRIMARY]: 200
          },
          classDistribution: {
            [SocialClass.ELITE]: 0,
            [SocialClass.MIDDLE]: 100,
            [SocialClass.WORKER]: 1000,
            [SocialClass.POOR]: 100
          },
          employment: { total: 1200, employed: 1100, unemployed: 100, retired: 0 },
          averageWage: 8,
          averageLivingStandard: 3,
          birthRate: 0.02,
          deathRate: 0.01,
          netMigration: 0,
          name: '农民',
          employedPopulation: 1100,
          unemployedPopulation: 100,
          wage: 8,
          growthRate: 0.02,
          standardOfLiving: 'medium'
        },
        {
          id: 'pop_workers',
          tileId: 'tile_1',
          totalPopulation: 800,
          groups: [workerGroup],
          ageDistribution: { children: 150, adults: 600, elders: 50 },
          educationDistribution: {
            [EducationLevel.BASIC]: 200,
            [EducationLevel.PRIMARY]: 500,
            [EducationLevel.SECONDARY]: 100
          },
          classDistribution: {
            [SocialClass.ELITE]: 50,
            [SocialClass.MIDDLE]: 200,
            [SocialClass.WORKER]: 500,
            [SocialClass.POOR]: 50
          },
          employment: { total: 800, employed: 750, unemployed: 50, retired: 0 },
          averageWage: 12,
          averageLivingStandard: 4,
          birthRate: 0.015,
          deathRate: 0.01,
          netMigration: 0,
          name: '工人',
          employedPopulation: 750,
          unemployedPopulation: 50,
          wage: 12,
          growthRate: 0.015,
          standardOfLiving: 'good'
        },
        {
          id: 'pop_merchants',
          tileId: 'tile_1',
          totalPopulation: 200,
          groups: [merchantGroup],
          ageDistribution: { children: 30, adults: 160, elders: 10 },
          educationDistribution: {
            [EducationLevel.PRIMARY]: 50,
            [EducationLevel.SECONDARY]: 150
          },
          classDistribution: {
            [SocialClass.ELITE]: 50,
            [SocialClass.MIDDLE]: 150,
            [SocialClass.WORKER]: 0,
            [SocialClass.POOR]: 0
          },
          employment: { total: 200, employed: 200, unemployed: 0, retired: 0 },
          averageWage: 25,
          averageLivingStandard: 5,
          birthRate: 0.01,
          deathRate: 0.008,
          netMigration: 0,
          name: '商人',
          employedPopulation: 200,
          unemployedPopulation: 0,
          wage: 25,
          growthRate: 0.01,
          standardOfLiving: 'excellent'
        }
      ]
    },

    tick() {
      if (!this.gameState || this.isPaused) return

      const daysPerTick = 1
      const currentDate = this.gameState.date
      
      currentDate.day += daysPerTick
      
      if (currentDate.day > 30) {
        currentDate.day = 1
        currentDate.month++
        
        if (currentDate.month > 12) {
          currentDate.month = 1
          currentDate.year++
        }
      }
      
      this.gameState.tickCount++
      this.updatePopulationGrowth()
      this.updateResearch()
    },

    updatePopulationGrowth() {
      this.populations.forEach(pop => {
        const growth = Math.floor(pop.totalPopulation * pop.growthRate / 12)
        pop.totalPopulation += growth
        pop.employedPopulation = Math.min(pop.employedPopulation + Math.floor(growth * 0.9), pop.totalPopulation)
        pop.unemployedPopulation = pop.totalPopulation - pop.employedPopulation
        pop.employment.employed = pop.employedPopulation
        pop.employment.total = pop.totalPopulation
        pop.employment.unemployed = pop.unemployedPopulation
      })
    },

    updateResearch() {
      const queue = this.gameState?.researchQueue
      if (!queue || !queue.current) return

      const techCost = this.getTechCost(queue.current.tech)
      
      if (queue.current.progress >= techCost) {
        this.gameState?.technologies.add(queue.current.tech)
        
        if (queue.queue.length > 0) {
          const nextTech = queue.queue.shift()
          queue.current = nextTech ? { tech: nextTech, progress: 0, estimatedCompletion: this.gameState!.date } : null
        } else {
          queue.current = null
        }
        
        this.addAlert('success', '科技研发完成', `已完成科技的研发`)
      }
    },

    getTechCost(techId: string): number {
      const costs: Record<string, number> = {
        'stone_tool': 50,
        'domestication': 100,
        'metal_smelting': 200,
        'iron_smelting': 300
      }
      return costs[techId] || 100
    },

    startTicking() {
      if (this.tickInterval) return
      this.tickInterval = window.setInterval(() => {
        this.tick()
      }, 1000)
    },

    stopTicking() {
      if (this.tickInterval) {
        clearInterval(this.tickInterval)
        this.tickInterval = null
      }
    },

    pause() {
      this.isPaused = true
    },

    resume() {
      this.isPaused = false
    },

    addAlert(type: GameAlert['type'], title: string, message: string) {
      const alert: GameAlert = {
        id: `alert_${Date.now()}_${Math.random()}`,
        type,
        title,
        message,
        timestamp: Date.now()
      }
      this.alerts.push(alert)
    },

    removeAlert(id: string) {
      const index = this.alerts.findIndex(a => a.id === id)
      if (index !== -1) {
        this.alerts.splice(index, 1)
      }
    },

    addBuilding(type: BuildingType) {
      const existingBuilding = this.buildings.find(b => b.type === type)
      
      if (existingBuilding) {
        existingBuilding.count += 1
        existingBuilding.workers = Math.min(
          existingBuilding.workers + existingBuilding.baseWorkers,
          existingBuilding.maxWorkers * existingBuilding.count
        )
        this.buildings = [...this.buildings]
        this.addAlert('success', '建筑扩建', `${this.getBuildingName(type)}数量增加到 ${existingBuilding.count}`)
      } else {
        const newBuilding: ExtendedBuilding = {
          id: `${type}_1`,
          name: this.getBuildingName(type),
          type,
          minEra: Era.STONE_AGE,
          baseWorkers: 10,
          maxWorkers: 20,
          baseThroughput: 80,
          productionMethods: [],
          level: 1,
          experience: 0,
          constructionCost: { wood: 50, stone: 20 },
          constructionTime: 20,
          tileId: `tile_${this.buildings.length + 1}`,
          efficiency: 1.0,
          workers: 0,
          count: 1
        }
        this.buildings = [...this.buildings, newBuilding]
        this.addAlert('success', '建筑完成', `已建造新的${this.getBuildingName(type)}`)
      }
    },

    getBuildingName(type: BuildingType): string {
      const names: Record<string, string> = {
        [BuildingType.FARM]: '农场',
        [BuildingType.RANCH]: '牧场',
        [BuildingType.FORESTRY]: '林场',
        [BuildingType.FISHERY]: '渔场',
        [BuildingType.QUARRY]: '矿场',
        [BuildingType.MINE]: '矿场',
        [BuildingType.WORKSHOP]: '工坊',
        [BuildingType.FACTORY]: '工厂'
      }
      return names[type] || type
    },

    buyGood(goodId: string, amount: number) {
      const prices: Record<string, number> = {
        food: 10,
        wood: 15,
        stone: 8,
        iron: 50
      }
      const price = prices[goodId] || 10
      const cost = price * amount
      
      if (this.gameState?.resources.money && this.gameState.resources.money >= cost) {
        this.gameState.resources.money -= cost
        const current = this.gameState.resources.goods.get(goodId) || 0
        this.gameState.resources.goods.set(goodId, current + amount)
        this.addAlert('success', '购买成功', `购买了${amount}单位${goodId}，花费¥${cost}`)
      } else {
        this.addAlert('error', '购买失败', '资金不足')
      }
    },

    sellGood(goodId: string, amount: number) {
      const prices: Record<string, number> = {
        food: 10,
        wood: 15,
        stone: 8,
        iron: 50
      }
      const price = prices[goodId] || 10
      const revenue = price * amount
      const current = this.gameState?.resources.goods.get(goodId) || 0
      
      if (current >= amount) {
        this.gameState!.resources.money += revenue
        this.gameState!.resources.goods.set(goodId, current - amount)
        this.addAlert('success', '出售成功', `出售了${amount}单位${goodId}，获得¥${revenue}`)
      } else {
        this.addAlert('error', '出售失败', '库存不足')
      }
    },

    $reset() {
      this.gameState = null
      this.isPaused = false
      this.alerts = []
      this.tickInterval = null
      this.buildings = []
      this.populations = []
    }
  }
})
