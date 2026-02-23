import { TransportCapacity, TileTransportCapacity, TransportType } from '../../models'

export interface ITransportManager {
  createCapacity(tileId: string, type: TransportType, level: number): TransportCapacity
  getCapacity(tileId: string, type: TransportType): TransportCapacity | undefined
  getTileCapacity(tileId: string): TileTransportCapacity | undefined
  updateCapacity(tileId: string, type: TransportType, usedCapacity: number): void
  upgradeCapacity(tileId: string, type: TransportType): void
  calculateTransportCost(fromTileId: string, toTileId: string, amount: number, type: TransportType): number
}

export class TransportManager implements ITransportManager {
  private capacities: Map<string, TileTransportCapacity>
  private nextId: number

  constructor() {
    this.capacities = new Map()
    this.nextId = 1
  }

  createCapacity(tileId: string, type: TransportType, level: number): TransportCapacity {
    const capacity: TransportCapacity = {
      id: `transport_${this.nextId++}`,
      tileId,
      type,
      level,
      maxCapacity: this.calculateMaxCapacity(type, level),
      usedCapacity: 0,
      efficiency: this.calculateEfficiency(type, level),
      maintenanceCost: this.calculateMaintenanceCost(type, level)
    }

    const tileCapacity = this.capacities.get(tileId) || this.createTileCapacity(tileId)
    tileCapacity.capacities.set(type, capacity)
    this.capacities.set(tileId, tileCapacity)

    return capacity
  }

  getCapacity(tileId: string, type: TransportType): TransportCapacity | undefined {
    const tileCapacity = this.capacities.get(tileId)
    if (!tileCapacity) return undefined
    return tileCapacity.capacities.get(type)
  }

  getTileCapacity(tileId: string): TileTransportCapacity | undefined {
    return this.capacities.get(tileId)
  }

  updateCapacity(tileId: string, type: TransportType, usedCapacity: number): void {
    const tileCapacity = this.capacities.get(tileId)
    if (!tileCapacity) {
      throw new Error(`Tile capacity not found: ${tileId}`)
    }

    const capacity = tileCapacity.capacities.get(type)
    if (!capacity) {
      throw new Error(`Transport capacity not found: ${type}`)
    }

    capacity.usedCapacity = Math.max(0, Math.min(usedCapacity, capacity.maxCapacity))
    this.updateTileCapacityStats(tileCapacity)
  }

  upgradeCapacity(tileId: string, type: TransportType): void {
    const tileCapacity = this.capacities.get(tileId)
    if (!tileCapacity) {
      throw new Error(`Tile capacity not found: ${tileId}`)
    }

    const capacity = tileCapacity.capacities.get(type)
    if (!capacity) {
      throw new Error(`Transport capacity not found: ${type}`)
    }

    capacity.level += 1
    capacity.maxCapacity = this.calculateMaxCapacity(type, capacity.level)
    capacity.efficiency = this.calculateEfficiency(type, capacity.level)
    capacity.maintenanceCost = this.calculateMaintenanceCost(type, capacity.level)
    capacity.usedCapacity = Math.min(capacity.usedCapacity, capacity.maxCapacity)

    this.updateTileCapacityStats(tileCapacity)
  }

  calculateTransportCost(fromTileId: string, toTileId: string, amount: number, type: TransportType): number {
    const fromCapacity = this.getCapacity(fromTileId, type)
    const toCapacity = this.getCapacity(toTileId, type)

    if (!fromCapacity || !toCapacity) {
      throw new Error('Both tiles must have transport capacity')
    }

    const distance = 10
    const baseCost = amount * distance
    const efficiency = Math.min(fromCapacity.efficiency, toCapacity.efficiency)

    return baseCost / efficiency
  }

  private createTileCapacity(tileId: string): TileTransportCapacity {
    return {
      tileId,
      capacities: new Map(),
      totalCapacity: 0,
      usedCapacity: 0,
      availableCapacity: 0,
      efficiency: 1.0
    }
  }

  private updateTileCapacityStats(tileCapacity: TileTransportCapacity): void {
    let totalCapacity = 0
    let usedCapacity = 0

    for (const capacity of tileCapacity.capacities.values()) {
      totalCapacity += capacity.maxCapacity
      usedCapacity += capacity.usedCapacity
    }

    tileCapacity.totalCapacity = totalCapacity
    tileCapacity.usedCapacity = usedCapacity
    tileCapacity.availableCapacity = totalCapacity - usedCapacity
    tileCapacity.efficiency = this.calculateTileEfficiency(tileCapacity)
  }

  private calculateTileEfficiency(tileCapacity: TileTransportCapacity): number {
    if (tileCapacity.totalCapacity === 0) return 1.0
    return tileCapacity.availableCapacity / tileCapacity.totalCapacity
  }

  private calculateMaxCapacity(type: TransportType, level: number): number {
    const baseCapacities: Record<TransportType, number> = {
      [TransportType.FOOT]: 10,
      [TransportType.CART]: 50,
      [TransportType.ROAD]: 200,
      [TransportType.RAILWAY]: 1000,
      [TransportType.HIGHWAY]: 2000,
      [TransportType.AIRPORT]: 5000,
      [TransportType.PORT]: 3000
    }

    const base = baseCapacities[type]
    return Math.floor(base * Math.pow(1.5, level - 1))
  }

  private calculateEfficiency(type: TransportType, level: number): number {
    const baseEfficiencies: Record<TransportType, number> = {
      [TransportType.FOOT]: 0.5,
      [TransportType.CART]: 0.6,
      [TransportType.ROAD]: 0.7,
      [TransportType.RAILWAY]: 0.8,
      [TransportType.HIGHWAY]: 0.9,
      [TransportType.AIRPORT]: 0.95,
      [TransportType.PORT]: 0.85
    }

    const base = baseEfficiencies[type]
    return Math.min(1.0, base + (level - 1) * 0.1)
  }

  private calculateMaintenanceCost(type: TransportType, level: number): number {
    const baseCosts: Record<TransportType, number> = {
      [TransportType.FOOT]: 0,
      [TransportType.CART]: 5,
      [TransportType.ROAD]: 20,
      [TransportType.RAILWAY]: 100,
      [TransportType.HIGHWAY]: 200,
      [TransportType.AIRPORT]: 500,
      [TransportType.PORT]: 150
    }

    const base = baseCosts[type]
    return Math.floor(base * Math.pow(1.2, level - 1))
  }
}
