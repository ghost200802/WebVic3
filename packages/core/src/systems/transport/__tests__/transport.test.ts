import { TransportManager } from '../index'
import { TransportType } from '../../../models'

describe('Transport System', () => {
  let manager: TransportManager

  beforeEach(() => {
    manager = new TransportManager()
  })

  describe('createCapacity', () => {
    it('should create transport capacity successfully', () => {
      const capacity = manager.createCapacity('tile_1', TransportType.ROAD, 1)
      
      expect(capacity).toBeDefined()
      expect(capacity.tileId).toBe('tile_1')
      expect(capacity.type).toBe(TransportType.ROAD)
      expect(capacity.level).toBe(1)
      expect(capacity.maxCapacity).toBeGreaterThan(0)
      expect(capacity.usedCapacity).toBe(0)
    })

    it('should create capacity with custom level', () => {
      const capacity = manager.createCapacity('tile_1', TransportType.ROAD, 2)
      
      expect(capacity.level).toBe(2)
    })
  })

  describe('getCapacity', () => {
    it('should return capacity by tile and type', () => {
      manager.createCapacity('tile_1', TransportType.ROAD, 1)
      const capacity = manager.getCapacity('tile_1', TransportType.ROAD)
      
      expect(capacity).toBeDefined()
      expect(capacity?.tileId).toBe('tile_1')
      expect(capacity?.type).toBe(TransportType.ROAD)
    })

    it('should return undefined for non-existent capacity', () => {
      const capacity = manager.getCapacity('non_existent', TransportType.ROAD)
      expect(capacity).toBeUndefined()
    })
  })

  describe('getTileCapacity', () => {
    it('should return all capacities for tile', () => {
      manager.createCapacity('tile_1', TransportType.ROAD, 1)
      manager.createCapacity('tile_1', TransportType.RAILWAY, 1)
      
      const tileCapacity = manager.getTileCapacity('tile_1')
      expect(tileCapacity).toBeDefined()
      expect(tileCapacity?.capacities.size).toBe(2)
    })

    it('should return undefined for non-existent tile', () => {
      const tileCapacity = manager.getTileCapacity('non_existent')
      expect(tileCapacity).toBeUndefined()
    })
  })

  describe('updateCapacity', () => {
    it('should update used capacity', () => {
      manager.createCapacity('tile_1', TransportType.ROAD, 1)
      manager.updateCapacity('tile_1', TransportType.ROAD, 50)
      
      const capacity = manager.getCapacity('tile_1', TransportType.ROAD)
      expect(capacity?.usedCapacity).toBe(50)
    })

    it('should clamp to maximum if exceeding maximum', () => {
      manager.createCapacity('tile_1', TransportType.ROAD, 1)
      const max = manager.getCapacity('tile_1', TransportType.ROAD)?.maxCapacity || 0
      
      manager.updateCapacity('tile_1', TransportType.ROAD, max + 1)
      
      const capacity = manager.getCapacity('tile_1', TransportType.ROAD)
      expect(capacity?.usedCapacity).toBe(max)
    })

    it('should throw error for non-existent capacity', () => {
      expect(() => {
        manager.updateCapacity('non_existent', TransportType.ROAD, 50)
      }).toThrow()
    })
  })

  describe('upgradeCapacity', () => {
    it('should increase capacity level', () => {
      const capacity = manager.createCapacity('tile_1', TransportType.ROAD, 1)
      const initialMax = capacity.maxCapacity
      manager.upgradeCapacity('tile_1', TransportType.ROAD)
      
      const upgraded = manager.getCapacity('tile_1', TransportType.ROAD)
      expect(upgraded?.level).toBe(2)
      expect(upgraded?.maxCapacity).toBeGreaterThanOrEqual(initialMax)
    })

    it('should throw error for non-existent capacity', () => {
      expect(() => {
        manager.upgradeCapacity('non_existent', TransportType.ROAD)
      }).toThrow()
    })
  })

  describe('calculateTransportCost', () => {
    it('should calculate transport cost', () => {
      manager.createCapacity('tile_1', TransportType.ROAD, 1)
      manager.createCapacity('tile_2', TransportType.ROAD, 1)
      
      const cost = manager.calculateTransportCost('tile_1', 'tile_2', 10, TransportType.ROAD)
      expect(cost).toBeGreaterThan(0)
    })

    it('should calculate cost based on amount', () => {
      manager.createCapacity('tile_1', TransportType.ROAD, 1)
      manager.createCapacity('tile_2', TransportType.ROAD, 1)
      
      const cost10 = manager.calculateTransportCost('tile_1', 'tile_2', 10, TransportType.ROAD)
      const cost20 = manager.calculateTransportCost('tile_1', 'tile_2', 20, TransportType.ROAD)
      
      expect(cost20).toBeGreaterThan(cost10)
    })

    it('should throw error for tiles without capacity', () => {
      expect(() => {
        manager.calculateTransportCost('tile_1', 'tile_2', 10, TransportType.ROAD)
      }).toThrow()
    })
  })
})
