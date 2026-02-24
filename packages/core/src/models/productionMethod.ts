import { Era } from './baseTypes'

export interface ProductionMethod {
  id: string
  name: string
  buildingType: string
  requiredTech?: string[]
  requiredEra?: Era
  inputs: Record<string, number>
  outputs: Record<string, number>
  throughputModifier: number
  workerEfficiency: number
  pollution?: number
  automationLevel: number
}

export const PRODUCTION_METHODS: Record<string, ProductionMethod> = {
  gathering: {
    id: 'gathering',
    name: '采集',
    buildingType: 'forestry',
    requiredEra: Era.STONE_AGE,
    inputs: {},
    outputs: { wood: 5 },
    throughputModifier: 0.6,
    workerEfficiency: 0.7,
    pollution: 0.05,
    automationLevel: 0
  },
  logging: {
    id: 'logging',
    name: '伐木',
    buildingType: 'forestry',
    requiredTech: ['tools'],
    requiredEra: Era.BRONZE_AGE,
    inputs: { stone: 1 },
    outputs: { wood: 15 },
    throughputModifier: 1.2,
    workerEfficiency: 1.0,
    pollution: 0.1,
    automationLevel: 0.1
  },
  modern_forestry: {
    id: 'modern_forestry',
    name: '现代林业',
    buildingType: 'forestry',
    requiredTech: ['chainsaw', 'sustainability'],
    requiredEra: Era.INDUSTRIAL,
    inputs: { steel: 2, oil: 1 },
    outputs: { wood: 50 },
    throughputModifier: 2.0,
    workerEfficiency: 1.8,
    pollution: 0.15,
    automationLevel: 0.6
  },
  fishing: {
    id: 'fishing',
    name: '捕鱼',
    buildingType: 'fishery',
    requiredEra: Era.STONE_AGE,
    inputs: { wood: 1 },
    outputs: { food: 8 },
    throughputModifier: 0.5,
    workerEfficiency: 0.8,
    pollution: 0.05,
    automationLevel: 0
  },
  aquaculture: {
    id: 'aquaculture',
    name: '水产养殖',
    buildingType: 'fishery',
    requiredTech: ['biology'],
    requiredEra: Era.RENAISSANCE,
    inputs: { wood: 2 },
    outputs: { food: 25 },
    throughputModifier: 1.5,
    workerEfficiency: 1.2,
    pollution: 0.1,
    automationLevel: 0.3
  },
  modern_fishing: {
    id: 'modern_fishing',
    name: '现代捕鱼',
    buildingType: 'fishery',
    requiredTech: ['radar', 'freezing'],
    requiredEra: Era.INDUSTRIAL,
    inputs: { steel: 3, oil: 2 },
    outputs: { food: 60 },
    throughputModifier: 2.5,
    workerEfficiency: 1.8,
    pollution: 0.2,
    automationLevel: 0.7
  },
  manual_mining: {
    id: 'manual_mining',
    name: '手工采石',
    buildingType: 'quarry',
    requiredEra: Era.STONE_AGE,
    inputs: { wood: 2 },
    outputs: { stone: 8 },
    throughputModifier: 0.5,
    workerEfficiency: 0.7,
    pollution: 0.1,
    automationLevel: 0
  },
  mechanized_quarry: {
    id: 'mechanized_quarry',
    name: '机械化采石',
    buildingType: 'quarry',
    requiredTech: ['explosives', 'mechanics'],
    requiredEra: Era.INDUSTRIAL,
    inputs: { steel: 3, coal: 2 },
    outputs: { stone: 40 },
    throughputModifier: 1.8,
    workerEfficiency: 1.5,
    pollution: 0.3,
    automationLevel: 0.5
  },
  surface_mining: {
    id: 'surface_mining',
    name: '露天开采',
    buildingType: 'mine',
    requiredEra: Era.BRONZE_AGE,
    inputs: { wood: 3, stone: 2 },
    outputs: { iron: 5 },
    throughputModifier: 0.8,
    workerEfficiency: 0.9,
    pollution: 0.2,
    automationLevel: 0.1
  },
  underground_mining: {
    id: 'underground_mining',
    name: '地下开采',
    buildingType: 'mine',
    requiredTech: ['tools', 'steam_engine'],
    requiredEra: Era.INDUSTRIAL,
    inputs: { wood: 5, steel: 2, coal: 3 },
    outputs: { iron: 20, coal: 10 },
    throughputModifier: 1.5,
    workerEfficiency: 1.2,
    pollution: 0.4,
    automationLevel: 0.3
  },
  modern_mining: {
    id: 'modern_mining',
    name: '现代采矿',
    buildingType: 'mine',
    requiredTech: ['electricity', 'drilling'],
    requiredEra: Era.ELECTRICAL,
    inputs: { steel: 5, oil: 4 },
    outputs: { iron: 40, coal: 25 },
    throughputModifier: 2.2,
    workerEfficiency: 1.6,
    pollution: 0.35,
    automationLevel: 0.7
  },
  grazing: {
    id: 'grazing',
    name: '放牧',
    buildingType: 'ranch',
    requiredEra: Era.STONE_AGE,
    inputs: {},
    outputs: { food: 5 },
    throughputModifier: 0.4,
    workerEfficiency: 0.7,
    pollution: 0.05,
    automationLevel: 0
  },
  livestock: {
    id: 'livestock',
    name: '畜牧',
    buildingType: 'ranch',
    requiredTech: ['domestication'],
    requiredEra: Era.BRONZE_AGE,
    inputs: { grain: 5 },
    outputs: { food: 20 },
    throughputModifier: 0.9,
    workerEfficiency: 1.0,
    pollution: 0.1,
    automationLevel: 0.1
  },
  intensive_ranching: {
    id: 'intensive_ranching',
    name: '集约化畜牧',
    buildingType: 'ranch',
    requiredTech: ['fertilizer', 'biology'],
    requiredEra: Era.INDUSTRIAL,
    inputs: { grain: 15, steel: 2 },
    outputs: { food: 50 },
    throughputModifier: 1.8,
    workerEfficiency: 1.4,
    pollution: 0.25,
    automationLevel: 0.5
  },
  slash_burn: {
    id: 'slash_burn',
    name: '刀耕火种',
    buildingType: 'farm',
    requiredEra: Era.STONE_AGE,
    inputs: { wood: 1 },
    outputs: { grain: 10 },
    throughputModifier: 0.5,
    workerEfficiency: 0.8,
    pollution: 0.1,
    automationLevel: 0
  },
  plowing: {
    id: 'plowing',
    name: '畜力耕作',
    buildingType: 'farm',
    requiredTech: ['domestication'],
    requiredEra: Era.BRONZE_AGE,
    inputs: { wood: 2 },
    outputs: { grain: 20 },
    throughputModifier: 0.8,
    workerEfficiency: 1.0,
    pollution: 0.15,
    automationLevel: 0.1
  },
  mechanized: {
    id: 'mechanized',
    name: '机械化',
    buildingType: 'farm',
    requiredTech: ['steam_engine', 'mechanics'],
    requiredEra: Era.INDUSTRIAL,
    inputs: { steel: 5, coal: 2 },
    outputs: { grain: 50 },
    throughputModifier: 1.5,
    workerEfficiency: 1.5,
    pollution: 0.3,
    automationLevel: 0.5
  },
  modern: {
    id: 'modern',
    name: '现代农业',
    buildingType: 'farm',
    requiredTech: ['electricity', 'fertilizer'],
    requiredEra: Era.INFORMATION,
    inputs: { steel: 3, oil: 2 },
    outputs: { grain: 100 },
    throughputModifier: 2.0,
    workerEfficiency: 2.0,
    pollution: 0.2,
    automationLevel: 0.8
  },
  handcraft: {
    id: 'handcraft',
    name: '手工制作',
    buildingType: 'workshop',
    requiredEra: Era.STONE_AGE,
    inputs: {},
    outputs: {},
    throughputModifier: 0.5,
    workerEfficiency: 0.7,
    pollution: 0.05,
    automationLevel: 0
  },
  steam_power: {
    id: 'steam_power',
    name: '蒸汽动力',
    buildingType: 'factory',
    requiredTech: ['steam_engine'],
    requiredEra: Era.INDUSTRIAL,
    inputs: { coal: 10 },
    outputs: { steel: 5 },
    throughputModifier: 1.0,
    workerEfficiency: 1.0,
    pollution: 0.5,
    automationLevel: 0.2
  },
  assembly_line: {
    id: 'assembly_line',
    name: '流水线生产',
    buildingType: 'factory',
    requiredTech: ['electricity', 'assembly_line_tech'],
    requiredEra: Era.ELECTRICAL,
    inputs: { coal: 15, steel: 2 },
    outputs: { steel: 15 },
    throughputModifier: 1.8,
    workerEfficiency: 1.3,
    pollution: 0.4,
    automationLevel: 0.5
  },
  automation: {
    id: 'automation',
    name: '自动化生产',
    buildingType: 'factory',
    requiredTech: ['computer', 'robotics'],
    requiredEra: Era.INFORMATION,
    inputs: { oil: 20, steel: 3 },
    outputs: { steel: 25 },
    throughputModifier: 2.2,
    workerEfficiency: 1.8,
    pollution: 0.3,
    automationLevel: 0.8
  },
  smart: {
    id: 'smart',
    name: '智能制造',
    buildingType: 'factory',
    requiredTech: ['ai', 'advanced_robotics'],
    requiredEra: Era.AI_AGE,
    inputs: { oil: 15, steel: 2 },
    outputs: { steel: 40 },
    throughputModifier: 3.0,
    workerEfficiency: 2.5,
    pollution: 0.1,
    automationLevel: 0.95
  }
}
