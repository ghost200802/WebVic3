import { Market, MarketPriceRecord, MarketEvent, GameDate } from '../../models'
import { IPriceCalculator, PriceCalculator } from './priceCalculator'

export interface IMarketManager {
  updatePrices(date: GameDate): void
  addSupply(goodsId: string, amount: number): void
  addDemand(goodsId: string, amount: number): void
  getPrice(goodsId: string): number
  executeTransaction(goodsId: string, amount: number, isPurchase: boolean): number
  getMarket(): Market
}

export class MarketManager implements IMarketManager {
  private market: Market
  private priceCalculator: IPriceCalculator
  private readonly MAX_HISTORY = 50

  constructor(name: string, regions: string[] = []) {
    this.priceCalculator = new PriceCalculator()
    this.market = {
      id: `market_${Date.now()}`,
      name,
      regions,
      prices: new Map(),
      supply: new Map(),
      demand: new Map(),
      stockpile: new Map(),
      events: []
    }
  }

  updatePrices(date: GameDate): void {
    for (const [goodsId] of this.market.prices.keys()) {
      this.updateGoodsPrice(goodsId, date)
    }

    this.processMarketEvents(date)
  }

  addSupply(goodsId: string, amount: number): void {
    const currentSupply = this.market.supply.get(goodsId) || 0
    this.market.supply.set(goodsId, currentSupply + amount)

    this.addToStockpile(goodsId, amount)
  }

  addDemand(goodsId: string, amount: number): void {
    const currentDemand = this.market.demand.get(goodsId) || 0
    this.market.demand.set(goodsId, currentDemand + amount)
  }

  getPrice(goodsId: string): number {
    const price = this.market.prices.get(goodsId)
    return price ? price.currentPrice : 0
  }

  executeTransaction(goodsId: string, amount: number, isPurchase: boolean): number {
    const price = this.getPrice(goodsId)
    const totalCost = price * amount

    if (isPurchase) {
      this.addDemand(goodsId, amount)
      this.removeFromStockpile(goodsId, amount)
    } else {
      this.addSupply(goodsId, amount)
    }

    return totalCost
  }

  getMarket(): Market {
    return { ...this.market }
  }

  private updateGoodsPrice(goodsId: string, date: GameDate): void {
    const price = this.market.prices.get(goodsId)
    if (!price) return

    const supply = this.market.supply.get(goodsId) || 0
    const demand = this.market.demand.get(goodsId) || 0
    const stockpile = this.market.stockpile.get(goodsId) || 0

    price.previousPrice = price.currentPrice
    price.currentPrice = this.priceCalculator.calculatePrice(
      price.basePrice,
      supply,
      demand,
      stockpile
    )

    const priceRecord: MarketPriceRecord = {
      date,
      price: price.currentPrice,
      supply,
      demand
    }

    price.history.push(priceRecord)
    if (price.history.length > this.MAX_HISTORY) {
      price.history.shift()
    }
  }

  private addToStockpile(goodsId: string, amount: number): void {
    const currentStockpile = this.market.stockpile.get(goodsId) || 0
    this.market.stockpile.set(goodsId, currentStockpile + amount)
  }

  private removeFromStockpile(goodsId: string, amount: number): void {
    const currentStockpile = this.market.stockpile.get(goodsId) || 0
    this.market.stockpile.set(goodsId, Math.max(0, currentStockpile - amount))
  }

  private processMarketEvents(date: GameDate): void {
    this.market.events = this.market.events.filter(event => {
      if (event.endDate && date > event.endDate) {
        return false
      }
      if (event.startDate <= date && !event.isActive) {
        this.applyEventEffects(event)
        event.isActive = true
      }
      return true
    })
  }

  private applyEventEffects(event: MarketEvent): void {
    if (event.effects.supplyModifier) {
      for (const [goodsId, modifier] of Object.entries(event.effects.supplyModifier)) {
        const currentSupply = this.market.supply.get(goodsId) || 0
        this.market.supply.set(goodsId, currentSupply * (1 + modifier))
      }
    }

    if (event.effects.demandModifier) {
      for (const [goodsId, modifier] of Object.entries(event.effects.demandModifier)) {
        const currentDemand = this.market.demand.get(goodsId) || 0
        this.market.demand.set(goodsId, currentDemand * (1 + modifier))
      }
    }

    if (event.effects.priceModifier) {
      for (const [goodsId, modifier] of Object.entries(event.effects.priceModifier)) {
        const price = this.market.prices.get(goodsId)
        if (price) {
          price.currentPrice *= (1 + modifier)
        }
      }
    }
  }
}
