

export interface IPriceCalculator {
  calculatePrice(
    basePrice: number,
    supply: number,
    demand: number,
    stockpile: number
  ): number
  calculatePriceAdjustment(
    currentPrice: number,
    basePrice: number,
    supply: number,
    demand: number
  ): number
}

export class PriceCalculator implements IPriceCalculator {
  private readonly SUPPLY_IMPACT = 0.5
  private readonly DEMAND_IMPACT = 0.5
  private readonly STOCKPILE_IMPACT = 0.1
  private readonly SMOOTHING_FACTOR = 0.2

  calculatePrice(
    basePrice: number,
    supply: number,
    demand: number,
    stockpile: number
  ): number {
    const supplyImpact = this.calculateSupplyImpact(supply)
    const demandImpact = this.calculateDemandImpact(demand)
    const stockpileImpact = this.calculateStockpileImpact(stockpile)

    const priceModifier = 1 + supplyImpact + demandImpact + stockpileImpact
    let newPrice = basePrice * priceModifier

    newPrice = Math.max(newPrice, basePrice * 0.1)
    newPrice = Math.min(newPrice, basePrice * 10)

    return newPrice
  }

  calculatePriceAdjustment(
    currentPrice: number,
    basePrice: number,
    supply: number,
    demand: number
  ): number {
    const ratio = currentPrice / basePrice
    const expectedRatio = this.calculateExpectedRatio(supply, demand)
    const adjustment = (expectedRatio - ratio) * this.SMOOTHING_FACTOR

    return adjustment
  }

  private calculateSupplyImpact(supply: number): number {
    if (supply <= 0) return 1.0
    return -this.SUPPLY_IMPACT * Math.log10(supply + 1) * 0.5
  }

  private calculateDemandImpact(demand: number): number {
    if (demand <= 0) return -1.0
    return this.DEMAND_IMPACT * Math.log10(demand + 1) * 0.5
  }

  private calculateStockpileImpact(stockpile: number): number {
    if (stockpile <= 0) return 0
    return -this.STOCKPILE_IMPACT * Math.tanh(stockpile / 100)
  }

  private calculateExpectedRatio(supply: number, demand: number): number {
    if (supply <= 0) return 10
    if (demand <= 0) return 0.1

    const balance = demand / supply
    if (balance > 2) return 2
    if (balance < 0.5) return 0.5

    return balance
  }
}
