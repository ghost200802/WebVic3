import { GameState } from '../../models/gameState'

export interface IStorageCapacityManager {
  getCapacity(tileId: string, goodsId: string): number
  setCapacity(tileId: string, goodsId: string, capacity: number): void
  getBaseCapacity(goodsId: string): number
  getWarehouseBonus(warehouseLevel: number): number
  updateCapacityFromWarehouse(tileId: string, warehouseLevel: number): void
  isFull(tileId: string, goodsId: string, currentInventory: number): boolean
}

export class StorageCapacityManager implements IStorageCapacityManager {
  private state: GameState
  private customCapacities: Map<string, Map<string, number>>
  private static readonly DEFAULT_BASE_CAPACITY = 1000

  constructor(state: GameState) {
    this.state = state
    this.customCapacities = new Map()
  }

  updateState(state: GameState): void {
    this.state = state
  }

  getCapacity(tileId: string, goodsId: string): number {
    const tileCapacities = this.customCapacities.get(tileId)
    if (tileCapacities && tileCapacities.has(goodsId)) {
      return tileCapacities.get(goodsId)!
    }
    return this.getBaseCapacity(goodsId)
  }

  setCapacity(tileId: string, goodsId: string, capacity: number): void {
    if (!this.customCapacities.has(tileId)) {
      this.customCapacities.set(tileId, new Map())
    }
    this.customCapacities.get(tileId)!.set(goodsId, Math.max(0, capacity))
  }

  getBaseCapacity(_goodsId: string): number {
    return StorageCapacityManager.DEFAULT_BASE_CAPACITY
  }

  getWarehouseBonus(warehouseLevel: number): number {
    if (warehouseLevel <= 0) {
      return 0
    }
    return warehouseLevel * 1000
  }

  updateCapacityFromWarehouse(tileId: string, warehouseLevel: number): void {
    const tile = this.state.tiles.get(tileId)
    if (!tile) return

    const baseCapacity = StorageCapacityManager.DEFAULT_BASE_CAPACITY
    const warehouseBonus = this.getWarehouseBonus(warehouseLevel)
    const totalCapacity = baseCapacity + warehouseBonus

    if (!this.customCapacities.has(tileId)) {
      this.customCapacities.set(tileId, new Map())
    }

    const tileCapacities = this.customCapacities.get(tileId)!
    for (const goodsId of tile.storage.keys()) {
      tileCapacities.set(goodsId, totalCapacity)
    }
  }

  isFull(tileId: string, goodsId: string, currentInventory: number): boolean {
    const capacity = this.getCapacity(tileId, goodsId)
    return currentInventory >= capacity
  }

  getWarehouseLevelCapacity(warehouseLevel: number): number {
    const baseCapacity = StorageCapacityManager.DEFAULT_BASE_CAPACITY
    const warehouseBonus = this.getWarehouseBonus(warehouseLevel)
    return baseCapacity + warehouseBonus
  }
}
