import { Era, GameDate } from './baseTypes'

export interface Technology {
  id: string
  name: string
  description: string
  era: Era
  prerequisites: string[]
  researchCost: number
  moneyCost: number
  goodsCost: Record<string, number>
  baseResearchTime: number
  unlocks: {
    buildings?: string[]
    productionMethods?: string[]
    goods?: string[]
    policies?: string[]
    units?: string[]
  }
  effects: TechEffect[]
}

export interface TechEffect {
  type: 'production_efficiency' | 'military' | 'population' | 'economy' | 'research'
  target?: string
  modifier: number
}

export interface ResearchQueue {
  current: {
    tech: string
    progress: number
    estimatedCompletion: GameDate
  }
  queue: string[]
  researchSpeed: number
}

export const TECHNOLOGIES: Record<string, Technology> = {
  stone_tool: {
    id: 'stone_tool',
    name: '石器制作',
    description: '学会制作石器，提高狩猎和采集效率',
    era: Era.STONE_AGE,
    prerequisites: [],
    researchCost: 50,
    moneyCost: 0,
    goodsCost: {},
    baseResearchTime: 30,
    unlocks: {},
    effects: [
      {
        type: 'production_efficiency',
        target: 'hunter_gatherer',
        modifier: 0.1
      }
    ]
  },
  domestication: {
    id: 'domestication',
    name: '驯化',
    description: '学会驯化动物，发展畜牧业',
    era: Era.BRONZE_AGE,
    prerequisites: ['stone_tool'],
    researchCost: 100,
    moneyCost: 0,
    goodsCost: {},
    baseResearchTime: 60,
    unlocks: {
      productionMethods: ['plowing']
    },
    effects: [
      {
        type: 'production_efficiency',
        target: 'ranch',
        modifier: 0.2
      }
    ]
  },
  metal_smelting: {
    id: 'metal_smelting',
    name: '金属冶炼',
    description: '学会冶炼铜和锡，制造青铜器',
    era: Era.BRONZE_AGE,
    prerequisites: ['domestication'],
    researchCost: 200,
    moneyCost: 0,
    goodsCost: {},
    baseResearchTime: 90,
    unlocks: {
      buildings: ['mine', 'workshop']
    },
    effects: []
  },
  iron_smelting: {
    id: 'iron_smelting',
    name: '铁器冶炼',
    description: '学会冶炼铁，制造铁器',
    era: Era.IRON_AGE,
    prerequisites: ['metal_smelting'],
    researchCost: 400,
    moneyCost: 0,
    goodsCost: {},
    baseResearchTime: 120,
    unlocks: {},
    effects: [
      {
        type: 'military',
        modifier: 0.3
      }
    ]
  },
  mechanics: {
    id: 'mechanics',
    name: '机械学',
    description: '理解机械原理，为工业革命奠定基础',
    era: Era.INDUSTRIAL,
    prerequisites: ['iron_smelting'],
    researchCost: 1000,
    moneyCost: 500,
    goodsCost: { iron: 100 },
    baseResearchTime: 200,
    unlocks: {},
    effects: [
      {
        type: 'production_efficiency',
        modifier: 0.2
      }
    ]
  },
  coal_mining: {
    id: 'coal_mining',
    name: '煤矿开采',
    description: '大规模开采煤炭，为蒸汽机提供燃料',
    era: Era.INDUSTRIAL,
    prerequisites: ['iron_smelting'],
    researchCost: 800,
    moneyCost: 300,
    goodsCost: { iron: 50 },
    baseResearchTime: 150,
    unlocks: {},
    effects: []
  },
  steam_engine: {
    id: 'steam_engine',
    name: '蒸汽机',
    description: '发明蒸汽机，开启工业革命',
    era: Era.INDUSTRIAL,
    prerequisites: ['mechanics', 'coal_mining'],
    researchCost: 2000,
    moneyCost: 1000,
    goodsCost: { iron: 200, coal: 100 },
    baseResearchTime: 300,
    unlocks: {
      buildings: ['factory'],
      productionMethods: ['steam_power', 'mechanized']
    },
    effects: [
      {
        type: 'production_efficiency',
        modifier: 0.5
      }
    ]
  },
  physics: {
    id: 'physics',
    name: '物理学',
    description: '建立物理学理论，理解电和磁',
    era: Era.ELECTRICAL,
    prerequisites: ['steam_engine'],
    researchCost: 2500,
    moneyCost: 1500,
    goodsCost: { steel: 100 },
    baseResearchTime: 250,
    unlocks: {},
    effects: [
      {
        type: 'research',
        modifier: 0.3
      }
    ]
  },
  electricity: {
    id: 'electricity',
    name: '电力',
    description: '掌握电力技术，点亮城市',
    era: Era.ELECTRICAL,
    prerequisites: ['steam_engine', 'physics'],
    researchCost: 3000,
    moneyCost: 2000,
    goodsCost: { steel: 200, coal: 150 },
    baseResearchTime: 350,
    unlocks: {
      buildings: ['modern_factory'],
      productionMethods: ['assembly_line', 'modern']
    },
    effects: [
      {
        type: 'economy',
        modifier: 0.4
      }
    ]
  },
  assembly_line_tech: {
    id: 'assembly_line_tech',
    name: '流水线技术',
    description: '发明流水线生产，大幅提高生产效率',
    era: Era.ELECTRICAL,
    prerequisites: ['electricity'],
    researchCost: 3500,
    moneyCost: 2500,
    goodsCost: { steel: 300, oil: 100 },
    baseResearchTime: 400,
    unlocks: {
      productionMethods: ['assembly_line']
    },
    effects: [
      {
        type: 'production_efficiency',
        modifier: 0.3
      }
    ]
  },
  electronics: {
    id: 'electronics',
    name: '电子学',
    description: '发明电子设备，为信息时代奠定基础',
    era: Era.INFORMATION,
    prerequisites: ['electricity'],
    researchCost: 4000,
    moneyCost: 3000,
    goodsCost: { steel: 200, oil: 150 },
    baseResearchTime: 450,
    unlocks: {},
    effects: [
      {
        type: 'research',
        modifier: 0.4
      }
    ]
  },
  computer: {
    id: 'computer',
    name: '计算机',
    description: '发明计算机，开启信息时代',
    era: Era.INFORMATION,
    prerequisites: ['electricity', 'electronics'],
    researchCost: 5000,
    moneyCost: 4000,
    goodsCost: { steel: 300, oil: 200 },
    baseResearchTime: 500,
    unlocks: {
      productionMethods: ['automation']
    },
    effects: [
      {
        type: 'research',
        modifier: 0.5
      }
    ]
  },
  fertilizer: {
    id: 'fertilizer',
    name: '化肥',
    description: '发明化肥，大幅提高农业产量',
    era: Era.INFORMATION,
    prerequisites: ['electricity', 'chemistry'],
    researchCost: 3000,
    moneyCost: 2000,
    goodsCost: { steel: 100, oil: 100 },
    baseResearchTime: 400,
    unlocks: {
      productionMethods: ['modern']
    },
    effects: [
      {
        type: 'population',
        modifier: 0.3
      }
    ]
  },
  machine_learning: {
    id: 'machine_learning',
    name: '机器学习',
    description: '开发机器学习算法',
    era: Era.AI_AGE,
    prerequisites: ['computer'],
    researchCost: 8000,
    moneyCost: 5000,
    goodsCost: { steel: 500, oil: 300 },
    baseResearchTime: 700,
    unlocks: {},
    effects: [
      {
        type: 'research',
        modifier: 0.6
      }
    ]
  },
  advanced_robotics: {
    id: 'advanced_robotics',
    name: '先进机器人技术',
    description: '开发先进机器人，实现高度自动化',
    era: Era.AI_AGE,
    prerequisites: ['machine_learning'],
    researchCost: 9000,
    moneyCost: 6000,
    goodsCost: { steel: 600, oil: 400 },
    baseResearchTime: 800,
    unlocks: {
      productionMethods: ['smart']
    },
    effects: [
      {
        type: 'production_efficiency',
        modifier: 0.8
      }
    ]
  },
  ai: {
    id: 'ai',
    name: '人工智能',
    description: '开发通用人工智能',
    era: Era.AI_AGE,
    prerequisites: ['computer', 'machine_learning'],
    researchCost: 10000,
    moneyCost: 8000,
    goodsCost: { steel: 800, oil: 500 },
    baseResearchTime: 1000,
    unlocks: {},
    effects: [
      {
        type: 'research',
        modifier: 1.0
      },
      {
        type: 'production_efficiency',
        modifier: 1.0
      }
    ]
  }
}
