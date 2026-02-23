import { GameDate } from './baseTypes'

export interface Market {
  id: string
  name: string
  regions: string[]
  prices: Map<string, Price>
  supply: Map<string, number>
  demand: Map<string, number>
  stockpile: Map<string, number>
  events: MarketEvent[]
}

export interface Price {
  basePrice: number
  currentPrice: number
  previousPrice: number
  history: MarketPriceRecord[]
}

export interface MarketPriceRecord {
  date: GameDate
  price: number
  supply: number
  demand: number
}

export interface MarketEvent {
  id: string
  type: 'harvest' | 'famine' | 'boom' | 'recession' | 'discovery'
  description: string
  startDate: GameDate
  endDate?: GameDate
  effects: {
    supplyModifier?: Record<string, number>
    demandModifier?: Record<string, number>
    priceModifier?: Record<string, number>
  }
  isActive: boolean
}

export interface Trade {
  id: string
  fromMarket: string
  toMarket: string
  goods: {
    goodsId: string
    amount: number
    price: number
  }[]
  transportCost: number
  tariff: number
  status: 'active' | 'pending' | 'cancelled'
}
