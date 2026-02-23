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
