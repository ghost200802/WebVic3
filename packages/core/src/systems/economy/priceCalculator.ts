import { GameDate } from '../../models'

export interface PriceHistoryEntry {
  date: GameDate
  price: number
  inventory: number
  capacity: number
  ratio: number
}

export interface IPriceCalculator {
  calculatePrice(
    basePrice: number,
    inventory: number,
    capacity: number
  ): number
  calculatePriceMultiplier(inventory: number, capacity: number): number
  getInventoryRatio(inventory: number, capacity: number): number
}

export class PriceCalculator implements IPriceCalculator {
  private static readonly RATIO_20 = 0.2
  private static readonly RATIO_50 = 0.5
  private static readonly RATIO_80 = 0.8

  calculatePrice(
    basePrice: number,
    inventory: number,
    capacity: number
  ): number {
    const multiplier = this.calculatePriceMultiplier(inventory, capacity)
    return basePrice * multiplier
  }

  calculatePriceMultiplier(inventory: number, capacity: number): number {
    if (capacity <= 0) {
      return 1.0
    }

    const ratio = this.getInventoryRatio(inventory, capacity)

    if (ratio <= PriceCalculator.RATIO_20) {
      return this.calculateLowInventoryMultiplier(ratio)
    } else if (ratio <= PriceCalculator.RATIO_50) {
      return this.calculateMediumLowInventoryMultiplier(ratio)
    } else if (ratio <= PriceCalculator.RATIO_80) {
      return this.calculateMediumHighInventoryMultiplier(ratio)
    } else {
      return this.calculateHighInventoryMultiplier(ratio)
    }
  }

  getInventoryRatio(inventory: number, capacity: number): number {
    if (capacity <= 0) {
      return 0
    }
    return Math.min(1, Math.max(0, inventory / capacity))
  }

  private calculateLowInventoryMultiplier(ratio: number): number {
    if (ratio <= 0) {
      return 5.0
    }
    return 1.5 + (0.2 - ratio) / 0.2 * 3.5
  }

  private calculateMediumLowInventoryMultiplier(ratio: number): number {
    return 1 + (0.5 - ratio) / 0.3 * 0.5
  }

  private calculateMediumHighInventoryMultiplier(ratio: number): number {
    return 1 - (ratio - 0.5) / 0.3 * 0.33
  }

  private calculateHighInventoryMultiplier(ratio: number): number {
    return 0.67 - (ratio - 0.8) / 0.2 * 0.47
  }
}
