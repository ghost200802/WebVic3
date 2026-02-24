import { GameState, GameDate } from '../../models'
import { StorageManager } from '../storage/storageManager'
import { IPriceCalculator, PriceCalculator, PriceHistoryEntry } from './priceCalculator'
import { IStorageCapacityManager, StorageCapacityManager } from './storageCapacityManager'
import { GOODS_CONFIG } from '../../models/goods'

export interface TilePriceData {
  currentPrice: number
  basePrice: number
  history: PriceHistoryEntry[]
}

export interface IPriceManager {
  updateTilePrices(tileId: string, date: GameDate): void
  updateAllPrices(date: GameDate): void
  getPrice(tileId: string, goodsId: string): number
  getBasePrice(goodsId: string): number
  setBasePrice(goodsId: string, price: number): void
  getStorageCapacity(tileId: string, goodsId: string): number
  setStorageCapacity(tileId: string, goodsId: string, capacity: number): void
  updateStorageCapacityFromWarehouse(tileId: string, warehouseLevel: number): void
  getPriceHistory(tileId: string, goodsId: string): PriceHistoryEntry[]
  recordPrice(tileId: string, goodsId: string, date: GameDate): void
}

export class PriceManager implements IPriceManager {
  private state: GameState
  private storageManager: StorageManager
  private capacityManager: IStorageCapacityManager
  private priceCalculator: IPriceCalculator
  private tilePrices: Map<string, Map<string, TilePriceData>>
  private customBasePrices: Map<string, number>
  private readonly MAX_HISTORY = 50

  constructor(state: GameState) {
    this.state = state
    this.storageManager = new StorageManager(state)
    this.capacityManager = new StorageCapacityManager(state)
    this.priceCalculator = new PriceCalculator()
    this.tilePrices = new Map()
    this.customBasePrices = new Map()
    this.initializePrices()
  }

  updateState(state: GameState): void {
    this.state = state
    this.storageManager.updateState(state)
    if (this.capacityManager instanceof StorageCapacityManager) {
      this.capacityManager.updateState(state)
    }
  }

  private initializePrices(): void {
    for (const tileId of this.state.tiles.keys()) {
      if (!this.tilePrices.has(tileId)) {
        this.tilePrices.set(tileId, new Map())
      }
    }
  }

  updateTilePrices(tileId: string, date: GameDate): void {
    const tile = this.state.tiles.get(tileId)
    if (!tile) return

    const tilePriceMap = this.getOrCreateTilePriceMap(tileId)

    for (const [goodsId] of tile.storage) {
      this.updateGoodsPrice(tileId, goodsId, date, tilePriceMap)
    }
  }

  updateAllPrices(date: GameDate): void {
    for (const tileId of this.state.tiles.keys()) {
      this.updateTilePrices(tileId, date)
    }
  }

  getPrice(tileId: string, goodsId: string): number {
    const tilePriceMap = this.tilePrices.get(tileId)
    if (tilePriceMap && tilePriceMap.has(goodsId)) {
      return tilePriceMap.get(goodsId)!.currentPrice
    }

    const basePrice = this.getBasePrice(goodsId)
    const inventory = this.storageManager.getGoodsFromTile(tileId, goodsId)
    const capacity = this.capacityManager.getCapacity(tileId, goodsId)
    return this.priceCalculator.calculatePrice(basePrice, inventory, capacity)
  }

  getBasePrice(goodsId: string): number {
    if (this.customBasePrices.has(goodsId)) {
      return this.customBasePrices.get(goodsId)!
    }

    const goodsConfig = GOODS_CONFIG[goodsId]
    if (goodsConfig) {
      return goodsConfig.basePrice
    }

    return 10
  }

  setBasePrice(goodsId: string, price: number): void {
    this.customBasePrices.set(goodsId, Math.max(0, price))
  }

  getStorageCapacity(tileId: string, goodsId: string): number {
    return this.capacityManager.getCapacity(tileId, goodsId)
  }

  setStorageCapacity(tileId: string, goodsId: string, capacity: number): void {
    this.capacityManager.setCapacity(tileId, goodsId, capacity)
  }

  updateStorageCapacityFromWarehouse(tileId: string, warehouseLevel: number): void {
    this.capacityManager.updateCapacityFromWarehouse(tileId, warehouseLevel)
  }

  getPriceHistory(tileId: string, goodsId: string): PriceHistoryEntry[] {
    const tilePriceMap = this.tilePrices.get(tileId)
    if (!tilePriceMap || !tilePriceMap.has(goodsId)) {
      return []
    }
    return [...tilePriceMap.get(goodsId)!.history]
  }

  recordPrice(tileId: string, goodsId: string, date: GameDate): void {
    const tilePriceMap = this.getOrCreateTilePriceMap(tileId)
    this.updateGoodsPrice(tileId, goodsId, date, tilePriceMap)
  }

  private getOrCreateTilePriceMap(tileId: string): Map<string, TilePriceData> {
    if (!this.tilePrices.has(tileId)) {
      this.tilePrices.set(tileId, new Map())
    }
    return this.tilePrices.get(tileId)!
  }

  private updateGoodsPrice(
    tileId: string,
    goodsId: string,
    date: GameDate,
    tilePriceMap: Map<string, TilePriceData>
  ): void {
    const basePrice = this.getBasePrice(goodsId)
    const inventory = this.storageManager.getGoodsFromTile(tileId, goodsId)
    const capacity = this.capacityManager.getCapacity(tileId, goodsId)
    const ratio = this.priceCalculator.getInventoryRatio(inventory, capacity)
    const currentPrice = this.priceCalculator.calculatePrice(basePrice, inventory, capacity)

    const historyEntry: PriceHistoryEntry = {
      date,
      price: currentPrice,
      inventory,
      capacity,
      ratio
    }

    if (!tilePriceMap.has(goodsId)) {
      tilePriceMap.set(goodsId, {
        currentPrice,
        basePrice,
        history: [historyEntry]
      })
    } else {
      const priceData = tilePriceMap.get(goodsId)!
      priceData.currentPrice = currentPrice
      priceData.basePrice = basePrice
      priceData.history.push(historyEntry)

      if (priceData.history.length > this.MAX_HISTORY) {
        priceData.history.shift()
      }
    }
  }
}
