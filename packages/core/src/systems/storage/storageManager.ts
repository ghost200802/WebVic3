import { GameState } from '../../models/gameState'

export interface StorageOperationResult {
  success: boolean
  actualAmount: number
  message?: string
}

export interface StorageSummary {
  tileId: string
  tileName: string
  goods: Map<string, number>
  totalItems: number
}

export class StorageManager {
  private state: GameState

  constructor(state: GameState) {
    this.state = state
  }

  updateState(state: GameState): void {
    this.state = state
  }

  getTileStorage(tileId: string): Map<string, number> {
    const tile = this.state.tiles.get(tileId)
    return tile?.storage || new Map()
  }

  getGlobalStorage(): Map<string, number> {
    return new Map(this.state.globalStorage)
  }

  getGoodsFromTile(tileId: string, goodsId: string): number {
    const tile = this.state.tiles.get(tileId)
    return tile?.storage.get(goodsId) || 0
  }

  getGoodsFromGlobal(goodsId: string): number {
    return this.state.globalStorage.get(goodsId) || 0
  }

  hasGoodsInTile(tileId: string, goodsId: string, amount: number): boolean {
    return this.getGoodsFromTile(tileId, goodsId) >= amount
  }

  hasGoodsInGlobal(goodsId: string, amount: number): boolean {
    return this.getGoodsFromGlobal(goodsId) >= amount
  }

  addGoodsToTile(tileId: string, goodsId: string, amount: number): StorageOperationResult {
    const actualAmount = Math.max(0, amount)
    const tile = this.state.tiles.get(tileId)

    if (!tile) {
      return {
        success: false,
        actualAmount: 0,
        message: `Tile ${tileId} not found`
      }
    }

    const currentAmount = tile.storage.get(goodsId) || 0
    tile.storage.set(goodsId, currentAmount + actualAmount)

    return {
      success: true,
      actualAmount
    }
  }

  removeGoodsFromTile(tileId: string, goodsId: string, amount: number): StorageOperationResult {
    const actualAmount = Math.max(0, amount)
    const tile = this.state.tiles.get(tileId)

    if (!tile) {
      return {
        success: false,
        actualAmount: 0,
        message: `Tile ${tileId} not found`
      }
    }

    const currentAmount = tile.storage.get(goodsId) || 0
    const newAmount = Math.max(0, currentAmount - actualAmount)
    tile.storage.set(goodsId, newAmount)

    return {
      success: true,
      actualAmount: Math.min(actualAmount, currentAmount)
    }
  }

  setGoodsInTile(tileId: string, goodsId: string, amount: number): StorageOperationResult {
    const actualAmount = Math.max(0, amount)
    const tile = this.state.tiles.get(tileId)

    if (!tile) {
      return {
        success: false,
        actualAmount: 0,
        message: `Tile ${tileId} not found`
      }
    }

    tile.storage.set(goodsId, actualAmount)

    return {
      success: true,
      actualAmount
    }
  }

  transferGoodsToGlobal(tileId: string, goodsId: string, amount: number): StorageOperationResult {
    if (!this.hasGoodsInTile(tileId, goodsId, amount)) {
      return {
        success: false,
        actualAmount: 0,
        message: `Insufficient goods in tile ${tileId}`
      }
    }

    const removeResult = this.removeGoodsFromTile(tileId, goodsId, amount)
    if (!removeResult.success) {
      return removeResult
    }

    this.addGoodsToGlobal(goodsId, amount)

    return {
      success: true,
      actualAmount: removeResult.actualAmount
    }
  }

  addGoodsToGlobal(goodsId: string, amount: number): StorageOperationResult {
    const actualAmount = Math.max(0, amount)
    const currentAmount = this.state.globalStorage.get(goodsId) || 0
    this.state.globalStorage.set(goodsId, currentAmount + actualAmount)

    return {
      success: true,
      actualAmount
    }
  }

  removeGoodsFromGlobal(goodsId: string, amount: number): StorageOperationResult {
    const actualAmount = Math.max(0, amount)
    const currentAmount = this.state.globalStorage.get(goodsId) || 0
    const newAmount = Math.max(0, currentAmount - actualAmount)
    this.state.globalStorage.set(goodsId, newAmount)

    return {
      success: true,
      actualAmount: Math.min(actualAmount, currentAmount)
    }
  }

  setGoodsInGlobal(goodsId: string, amount: number): StorageOperationResult {
    const actualAmount = Math.max(0, amount)
    this.state.globalStorage.set(goodsId, actualAmount)

    return {
      success: true,
      actualAmount
    }
  }

  clearTileStorage(tileId: string): boolean {
    const tile = this.state.tiles.get(tileId)
    if (!tile) return false

    tile.storage.clear()
    return true
  }

  clearGlobalStorage(): void {
    this.state.globalStorage.clear()
  }

  getTileStorageSummary(tileId: string): StorageSummary | null {
    const tile = this.state.tiles.get(tileId)
    if (!tile) return null

    let totalItems = 0
    for (const amount of tile.storage.values()) {
      totalItems += amount
    }

    return {
      tileId: tile.id,
      tileName: tile.name,
      goods: new Map(tile.storage),
      totalItems
    }
  }

  getAllTileStorageSummaries(): StorageSummary[] {
    const summaries: StorageSummary[] = []

    for (const tile of this.state.tiles.values()) {
      let totalItems = 0
      for (const amount of tile.storage.values()) {
        totalItems += amount
      }

      summaries.push({
        tileId: tile.id,
        tileName: tile.name,
        goods: new Map(tile.storage),
        totalItems
      })
    }

    return summaries
  }

  getGlobalStorageSummary(): { goods: Map<string, number>; totalItems: number } {
    const goods = new Map(this.state.globalStorage)
    let totalItems = 0

    for (const amount of goods.values()) {
      totalItems += amount
    }

    return { goods, totalItems }
  }

  syncGlobalStorageFromTiles(): void {
    this.state.globalStorage.clear()

    for (const tile of this.state.tiles.values()) {
      for (const [goodsId, amount] of tile.storage.entries()) {
        const currentAmount = this.state.globalStorage.get(goodsId) || 0
        this.state.globalStorage.set(goodsId, currentAmount + amount)
      }
    }
  }

  getGoodsList(tileId: string): Array<{ goodsId: string; amount: number }> {
    const tile = this.state.tiles.get(tileId)
    if (!tile) return []

    return Array.from(tile.storage.entries()).map(([goodsId, amount]) => ({
      goodsId,
      amount
    }))
  }

  getGlobalGoodsList(): Array<{ goodsId: string; amount: number }> {
    return Array.from(this.state.globalStorage.entries()).map(([goodsId, amount]) => ({
      goodsId,
      amount
    }))
  }
}
