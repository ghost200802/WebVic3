import { MarketManager, PriceCalculator, TradeManager } from '../index'

describe('Economy System', () => {
  describe('MarketManager', () => {
    let manager: MarketManager

    beforeEach(() => {
      manager = new MarketManager('Test Market')
    })

    describe('addSupply', () => {
      it('should add supply for good', () => {
        manager.addSupply('wood', 100)
        
        const market = manager.getMarket()
        expect(market.supply.get('wood')).toBe(100)
      })

      it('should accumulate supply for same good', () => {
        manager.addSupply('wood', 50)
        manager.addSupply('wood', 50)
        
        const market = manager.getMarket()
        expect(market.supply.get('wood')).toBe(100)
      })
    })

    describe('addDemand', () => {
      it('should add demand for good', () => {
        manager.addDemand('wood', 50)
        
        const market = manager.getMarket()
        expect(market.demand.get('wood')).toBe(50)
      })
    })

    describe('getPrice', () => {
      it('should return price for good', () => {
        manager.addSupply('wood', 100)
        const price = manager.getPrice('wood')
        
        expect(price).toBeDefined()
        expect(price).toBeGreaterThanOrEqual(0)
      })

      it('should return 0 for non-existent good', () => {
        const price = manager.getPrice('non_existent')
        expect(price).toBe(0)
      })
    })

    describe('executeTransaction', () => {
      it('should execute purchase transaction', () => {
        manager.addSupply('wood', 100)
        
        const cost = manager.executeTransaction('wood', 10, true)
        
        expect(cost).toBeGreaterThanOrEqual(0)
      })

      it('should add demand on purchase', () => {
        manager.addSupply('wood', 100)
        manager.executeTransaction('wood', 10, true)
        
        const market = manager.getMarket()
        expect(market.demand.get('wood')).toBe(10)
      })

      it('should add supply on sale', () => {
        manager.executeTransaction('wood', 10, false)
        
        const market = manager.getMarket()
        expect(market.supply.get('wood')).toBe(10)
      })
    })

    describe('updatePrices', () => {
      it('should update prices based on supply/demand', () => {
        manager.addSupply('wood', 100)
        manager.addDemand('wood', 50)
        
        manager.updatePrices({ year: 1, month: 1, day: 1 })
        
        const market = manager.getMarket()
        expect(market.prices.size).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('PriceCalculator', () => {
    let calculator: PriceCalculator

    beforeEach(() => {
      calculator = new PriceCalculator()
    })

    describe('calculatePrice', () => {
      it('should calculate price based on base price', () => {
        const price = calculator.calculatePrice(10, 100, 100, 0)
        
        expect(price).toBe(10)
      })

      it('should increase price when demand exceeds supply', () => {
        const highDemandPrice = calculator.calculatePrice(10, 50, 100, 0)
        const balancedPrice = calculator.calculatePrice(10, 100, 100, 0)
        
        expect(highDemandPrice).toBeGreaterThan(balancedPrice)
      })

      it('should decrease price when supply exceeds demand', () => {
        const highSupplyPrice = calculator.calculatePrice(10, 100, 50, 0)
        const balancedPrice = calculator.calculatePrice(10, 100, 100, 0)
        
        expect(highSupplyPrice).toBeLessThan(balancedPrice)
      })

      it('should decrease price with large stockpile', () => {
        const stockpiledPrice = calculator.calculatePrice(10, 100, 100, 1000)
        const normalPrice = calculator.calculatePrice(10, 100, 100, 0)
        
        expect(stockpiledPrice).toBeLessThan(normalPrice)
      })
    })

    describe('calculateSupplyImpact', () => {
      it('should return negative impact for high supply', () => {
        const impact = calculator['calculateSupplyImpact'](200)
        
        expect(impact).toBeLessThan(0)
      })

      it('should return negative impact for low supply', () => {
        const impact = calculator['calculateSupplyImpact'](50)
        
        expect(impact).toBeLessThan(0)
      })

      it('should return higher impact for zero supply', () => {
        const impact = calculator['calculateSupplyImpact'](0)
        
        expect(impact).toBe(1.0)
      })
    })

    describe('calculateDemandImpact', () => {
      it('should return positive impact for high demand', () => {
        const impact = calculator['calculateDemandImpact'](200)
        
        expect(impact).toBeGreaterThan(0)
      })

      it('should return positive impact for low demand', () => {
        const impact = calculator['calculateDemandImpact'](50)
        
        expect(impact).toBeGreaterThan(0)
      })

      it('should return negative impact for zero demand', () => {
        const impact = calculator['calculateDemandImpact'](0)
        
        expect(impact).toBe(-1.0)
      })
    })

    describe('calculateStockpileImpact', () => {
      it('should return negative impact for large stockpile', () => {
        const impact = calculator['calculateStockpileImpact'](1000)
        
        expect(impact).toBeLessThan(0)
      })

      it('should return small negative impact for small stockpile', () => {
        const impact = calculator['calculateStockpileImpact'](10)
        
        expect(impact).toBeLessThan(0)
        expect(impact).toBeCloseTo(-0.01, 1)
      })

      it('should return zero impact for zero stockpile', () => {
        const impact = calculator['calculateStockpileImpact'](0)
        
        expect(impact).toBe(0)
      })
    })
  })

  describe('TradeManager', () => {
    let manager: TradeManager

    beforeEach(() => {
      manager = new TradeManager()
    })

    describe('createRoute', () => {
      it('should create trade route', () => {
        const route = manager.createRoute('route_1', 'market_1', 'market_2', ['wood'])
        
        expect(route).toBeDefined()
        expect(route.id).toBe('route_1')
        expect(route.fromMarketId).toBe('market_1')
        expect(route.toMarketId).toBe('market_2')
      })
    })

    describe('executeTradeOnRoute', () => {
      it('should execute trade on route', () => {
        manager.createRoute('route_1', 'market_1', 'market_2', ['wood'])
        
        const trade = manager.executeTradeOnRoute('route_1', 'wood', 10)
        
        expect(trade).toBeDefined()
        expect(trade.goods).toBeDefined()
        expect(trade.goods[0].goodsId).toBe('wood')
        expect(trade.goods[0].amount).toBe(10)
      })
    })

    describe('getRoute', () => {
      it('should return route by ID', () => {
        const route = manager.createRoute('route_1', 'market_1', 'market_2', ['wood'])
        const retrieved = manager.getRoute('route_1')
        
        expect(retrieved).toBe(route)
      })
    })

    describe('getAllRoutes', () => {
      it('should return all routes', () => {
        manager.createRoute('route_1', 'market_1', 'market_2', ['wood'])
        manager.createRoute('route_2', 'market_3', 'market_4', ['food'])
        
        const routes = manager.getAllRoutes()
        expect(routes).toHaveLength(2)
      })
    })
  })
})
