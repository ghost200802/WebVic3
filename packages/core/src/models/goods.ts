import { GoodsType, GameDate, Era } from './baseTypes'

export interface Goods {
  id: string
  name: string
  type: GoodsType
  era: string
  basePrice: number
  priceHistory: PriceRecord[]
}

export interface PriceRecord {
  date: GameDate
  price: number
  supply: number
  demand: number
}

export const GOODS_CONFIG: Record<string, Goods> = {
  grain: {
    id: 'grain',
    name: '谷物',
    type: GoodsType.RAW_MATERIAL,
    era: Era.STONE_AGE,
    basePrice: 10,
    priceHistory: []
  },
  meat: {
    id: 'meat',
    name: '肉类',
    type: GoodsType.RAW_MATERIAL,
    era: Era.STONE_AGE,
    basePrice: 30,
    priceHistory: []
  },
  wood: {
    id: 'wood',
    name: '木材',
    type: GoodsType.RAW_MATERIAL,
    era: Era.STONE_AGE,
    basePrice: 5,
    priceHistory: []
  },
  stone: {
    id: 'stone',
    name: '石材',
    type: GoodsType.RAW_MATERIAL,
    era: Era.STONE_AGE,
    basePrice: 8,
    priceHistory: []
  },
  copper: {
    id: 'copper',
    name: '铜',
    type: GoodsType.RAW_MATERIAL,
    era: Era.BRONZE_AGE,
    basePrice: 25,
    priceHistory: []
  },
  tin: {
    id: 'tin',
    name: '锡',
    type: GoodsType.RAW_MATERIAL,
    era: Era.BRONZE_AGE,
    basePrice: 30,
    priceHistory: []
  },
  iron: {
    id: 'iron',
    name: '铁',
    type: GoodsType.RAW_MATERIAL,
    era: Era.IRON_AGE,
    basePrice: 20,
    priceHistory: []
  },
  coal: {
    id: 'coal',
    name: '煤炭',
    type: GoodsType.RAW_MATERIAL,
    era: Era.INDUSTRIAL,
    basePrice: 15,
    priceHistory: []
  },
  steel: {
    id: 'steel',
    name: '钢材',
    type: GoodsType.INTERMEDIATE,
    era: Era.INDUSTRIAL,
    basePrice: 100,
    priceHistory: []
  },
  oil: {
    id: 'oil',
    name: '石油',
    type: GoodsType.RAW_MATERIAL,
    era: Era.ELECTRICAL,
    basePrice: 80,
    priceHistory: []
  }
}
