export enum TransportType {
  FOOT = 'foot',
  CART = 'cart',
  ROAD = 'road',
  RAILWAY = 'railway',
  HIGHWAY = 'highway',
  AIRPORT = 'airport',
  PORT = 'port'
}

export interface TransportCapacity {
  id: string
  tileId: string
  type: TransportType
  level: number
  
  maxCapacity: number
  usedCapacity: number
  
  efficiency: number
  maintenanceCost: number
}

export interface TileTransportCapacity {
  tileId: string
  
  capacities: Map<TransportType, TransportCapacity>
  
  totalCapacity: number
  usedCapacity: number
  availableCapacity: number
  
  efficiency: number
}
