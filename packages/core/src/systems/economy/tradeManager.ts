import { Trade } from '../../models'

interface TradeRoute {
  id: string
  fromMarketId: string
  toMarketId: string
  goodsIds: string[]
  isActive: boolean
  currentLoad: number
  maxLoad: number
  tradeHistory: Trade[]
}

export interface ITradeManager {
  createRoute(id: string, fromMarketId: string, toMarketId: string, goodsIds: string[]): TradeRoute
  executeTradeOnRoute(routeId: string, goodsId: string, amount: number): Trade
  getRoute(id: string): TradeRoute | undefined
  getAllRoutes(): TradeRoute[]
  removeRoute(routeId: string): void
}

export class TradeManager implements ITradeManager {
  private routes: Map<string, TradeRoute>
  private nextTradeId: number

  constructor() {
    this.routes = new Map()
    this.nextTradeId = 1
  }

  createRoute(id: string, fromMarketId: string, toMarketId: string, goodsIds: string[]): TradeRoute {
    const route: TradeRoute = {
      id,
      fromMarketId,
      toMarketId,
      goodsIds,
      isActive: true,
      currentLoad: 0,
      maxLoad: 100,
      tradeHistory: []
    }

    this.routes.set(id, route)
    return route
  }

  executeTradeOnRoute(routeId: string, goodsId: string, amount: number): Trade {
    const route = this.routes.get(routeId)
    if (!route || !route.isActive) {
      throw new Error(`Route ${routeId} not found or inactive`)
    }

    if (route.currentLoad + amount > route.maxLoad) {
      throw new Error(`Route ${routeId} is at capacity`)
    }

    const trade: Trade = {
      id: `trade_${this.nextTradeId++}`,
      fromMarket: route.fromMarketId,
      toMarket: route.toMarketId,
      goods: [
        {
          goodsId,
          amount,
          price: 10
        }
      ],
      transportCost: 5,
      tariff: 0,
      status: 'active'
    }

    route.tradeHistory.push(trade)
    route.currentLoad += amount
    return trade
  }

  getRoute(id: string): TradeRoute | undefined {
    return this.routes.get(id)
  }

  getAllRoutes(): TradeRoute[] {
    return Array.from(this.routes.values())
  }

  removeRoute(routeId: string): void {
    this.routes.delete(routeId)
  }
}
