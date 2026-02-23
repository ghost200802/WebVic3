import {
  Era,
  BuildingType,
  GoodsType,
  AgeGroup,
  EducationLevel,
  SocialClass,
  EmploymentStatus,
  TerrainType,
  GameDate,
  createGameDate,
  Goods,
  GOODS_CONFIG,
  Building,
  BuildingConfig,
  BUILDING_CONFIGS,
  ProductionMethod,
  PRODUCTION_METHODS,
  Market,
  Price,
  MarketPriceRecord,
  MarketEvent,
  Trade,
  PopulationGroup,
  Population,
  Profession,
  Technology,
  TechEffect,
  ResearchQueue,
  TECHNOLOGIES,
  Tile,
  ResourceDeposit,
  DepositRichness,
  TileDevelopment,
  TerrainConfig,
  TERRAIN_CONFIGS,
  TransportType,
  TransportCapacity,
  TileTransportCapacity,
  GameState,
  GameSettings
} from '../src/models'

describe('Model Types', () => {
  describe('Base Types', () => {
    it('should have all era values', () => {
      expect(Era.STONE_AGE).toBe('stone_age')
      expect(Era.BRONZE_AGE).toBe('bronze_age')
      expect(Era.IRON_AGE).toBe('iron_age')
      expect(Era.CLASSICAL).toBe('classical')
      expect(Era.MEDIEVAL).toBe('medieval')
      expect(Era.RENAISSANCE).toBe('renaissance')
      expect(Era.INDUSTRIAL).toBe('industrial')
      expect(Era.ELECTRICAL).toBe('electrical')
      expect(Era.INFORMATION).toBe('information')
      expect(Era.AI_AGE).toBe('ai_age')
    })

    it('should create game date', () => {
      const date = createGameDate(2024, 1, 1)
      expect(date.year).toBe(2024)
      expect(date.month).toBe(1)
      expect(date.day).toBe(1)
    })
  })

  describe('Goods', () => {
    it('should have at least 10 goods configured', () => {
      const goodsIds = Object.keys(GOODS_CONFIG)
      expect(goodsIds.length).toBeGreaterThanOrEqual(10)
    })

    it('should have grain goods', () => {
      expect(GOODS_CONFIG.grain).toBeDefined()
      expect(GOODS_CONFIG.grain.name).toBe('谷物')
      expect(GOODS_CONFIG.grain.basePrice).toBe(10)
    })
  })

  describe('Buildings', () => {
    it('should have at least 10 building configs', () => {
      const buildingIds = Object.keys(BUILDING_CONFIGS)
      expect(buildingIds.length).toBeGreaterThanOrEqual(10)
    })

    it('should have farm building', () => {
      expect(BUILDING_CONFIGS.farm).toBeDefined()
      expect(BUILDING_CONFIGS.farm.name).toBe('农田')
      expect(BUILDING_CONFIGS.farm.baseWorkers).toBe(10)
    })
  })

  describe('Production Methods', () => {
    it('should have at least 8 production methods', () => {
      const methodIds = Object.keys(PRODUCTION_METHODS)
      expect(methodIds.length).toBeGreaterThanOrEqual(8)
    })

    it('should have automation level between 0 and 1', () => {
      Object.values(PRODUCTION_METHODS).forEach(method => {
        expect(method.automationLevel).toBeGreaterThanOrEqual(0)
        expect(method.automationLevel).toBeLessThanOrEqual(1)
      })
    })
  })

  describe('Technologies', () => {
    it('should have at least 7 technologies', () => {
      const techIds = Object.keys(TECHNOLOGIES)
      expect(techIds.length).toBeGreaterThanOrEqual(7)
    })

    it('should have stone_tool technology', () => {
      expect(TECHNOLOGIES.stone_tool).toBeDefined()
      expect(TECHNOLOGIES.stone_tool.name).toBe('石器制作')
      expect(TECHNOLOGIES.stone_tool.era).toBe(Era.STONE_AGE)
    })
  })

  describe('Terrain', () => {
    it('should have all terrain types configured', () => {
      expect(TERRAIN_CONFIGS[TerrainType.PLAINS]).toBeDefined()
      expect(TERRAIN_CONFIGS[TerrainType.FOREST]).toBeDefined()
      expect(TERRAIN_CONFIGS[TerrainType.HILLS]).toBeDefined()
      expect(TERRAIN_CONFIGS[TerrainType.WATER]).toBeDefined()
      expect(TERRAIN_CONFIGS[TerrainType.DESERT]).toBeDefined()
      expect(TERRAIN_CONFIGS[TerrainType.SNOW]).toBeDefined()
      expect(TERRAIN_CONFIGS[TerrainType.SWAMP]).toBeDefined()
      expect(TERRAIN_CONFIGS[TerrainType.MOUNTAIN]).toBeDefined()
    })

    it('should have plains terrain with correct values', () => {
      const plains = TERRAIN_CONFIGS[TerrainType.PLAINS]
      expect(plains.name).toBe('平原')
      expect(plains.buildableRatio).toBe(1.0)
      expect(plains.baseAgricultureYield).toBe(1.0)
    })
  })

  describe('Transport', () => {
    it('should have all transport types', () => {
      expect(TransportType.FOOT).toBe('foot')
      expect(TransportType.CART).toBe('cart')
      expect(TransportType.ROAD).toBe('road')
      expect(TransportType.RAILWAY).toBe('railway')
      expect(TransportType.HIGHWAY).toBe('highway')
      expect(TransportType.AIRPORT).toBe('airport')
      expect(TransportType.PORT).toBe('port')
    })
  })
})
