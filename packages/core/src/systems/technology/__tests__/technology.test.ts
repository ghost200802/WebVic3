import { TechnologyManager } from '../index'
import { TECHNOLOGIES } from '../../../models'

describe('Technology System', () => {
  let manager: TechnologyManager

  beforeEach(() => {
    manager = new TechnologyManager()
  })

  describe('addTechnology', () => {
    it('should add technology successfully', () => {
      manager.addTechnology('stone_tool')
      
      expect(manager.hasTechnology('stone_tool')).toBe(true)
    })

    it('should not add same technology twice', () => {
      manager.addTechnology('stone_tool')
      expect(() => {
        manager.addTechnology('stone_tool')
      }).not.toThrow()
      
      expect(manager.hasTechnology('stone_tool')).toBe(true)
    })
  })

  describe('hasTechnology', () => {
    it('should return true for owned technology', () => {
      manager.addTechnology('stone_tool')
      
      expect(manager.hasTechnology('stone_tool')).toBe(true)
    })

    it('should return false for unowned technology', () => {
      expect(manager.hasTechnology('domestication')).toBe(false)
    })
  })

  describe('getAvailableTechnologies', () => {
    it('should return technologies that can be researched', () => {
      const owned = new Set<string>()
      const available = manager.getAvailableTechnologies(owned)
      
      expect(available.length).toBeGreaterThan(0)
    })

    it('should update available technologies after adding tech', () => {
      const owned1 = new Set<string>()
      const before = manager.getAvailableTechnologies(owned1)
      
      const owned2 = new Set(['stone_tool'])
      const after = manager.getAvailableTechnologies(owned2)
      
      expect(after.length).toBeGreaterThanOrEqual(before.length)
    })

    it('should not return already owned technologies', () => {
      const owned = new Set(['stone_tool'])
      const available = manager.getAvailableTechnologies(owned)
      
      expect(available).not.toContain('stone_tool')
    })
  })

  describe('enqueueResearch', () => {
    it('should enqueue technology for research', () => {
      manager.enqueueResearch('stone_tool')
      
      const queue = manager.getResearchQueue()
      expect(queue.queue).toContain('stone_tool')
    })

    it('should throw error if technology already researched', () => {
      manager.addTechnology('stone_tool')
      
      expect(() => {
        manager.enqueueResearch('stone_tool')
      }).toThrow()
    })

    it('should add multiple technologies to queue', () => {
      manager.addTechnology('stone_tool')
      manager.addTechnology('domestication')
      manager.addTechnology('metal_smelting')
      manager.addTechnology('iron_smelting')
      manager.enqueueResearch('mechanics')
      manager.enqueueResearch('coal_mining')
      
      const queue = manager.getResearchQueue()
      expect(queue.queue).toHaveLength(2)
    })
  })

  describe('dequeueResearch', () => {
    it('should remove technology from queue', () => {
      manager.enqueueResearch('stone_tool')
      manager.dequeueResearch()
      
      const queue = manager.getResearchQueue()
      expect(queue.queue).toHaveLength(0)
    })
  })

  describe('advanceResearch', () => {
    it('should advance research progress', () => {
      manager.enqueueResearch('stone_tool')
      manager.advanceResearch(0)
      
      const current = manager.getCurrentResearch()
      expect(current?.progress).toBe(0)
    })

    it('should add technology when progress reaches completion', () => {
      manager.enqueueResearch('stone_tool')
      
      const tech = TECHNOLOGIES['stone_tool']
      manager.advanceResearch(tech.researchCost)
      
      expect(manager.hasTechnology('stone_tool')).toBe(true)
    })
  })

  describe('getCurrentResearch', () => {
    it('should return current research after advancing', () => {
      manager.enqueueResearch('stone_tool')
      manager.advanceResearch(0)
      
      const current = manager.getCurrentResearch()
      expect(current).not.toBeNull()
      expect(current?.tech).toBe('stone_tool')
    })

    it('should return null when no research', () => {
      const current = manager.getCurrentResearch()
      expect(current).toBeNull()
    })
  })

  describe('getResearchQueue', () => {
    it('should return research queue', () => {
      manager.enqueueResearch('stone_tool')
      
      const queue = manager.getResearchQueue()
      expect(queue.queue).toContain('stone_tool')
    })
  })
})
