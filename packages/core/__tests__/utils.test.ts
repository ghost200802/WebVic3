import { 
  clamp, 
  lerp, 
  mapRange, 
  distance, 
  percentage, 
  Random,
  random,
  randomInt,
  randomFloat,
  randomBool,
  shuffle,
  weightedRandom 
} from '../src'

describe('Math Utils', () => {
  describe('clamp', () => {
    it('should clamp value below min', () => {
      expect(clamp(5, 10, 20)).toBe(10)
    })

    it('should clamp value above max', () => {
      expect(clamp(25, 10, 20)).toBe(20)
    })

    it('should return value within range', () => {
      expect(clamp(15, 10, 20)).toBe(15)
    })

    it('should handle edge cases', () => {
      expect(clamp(10, 10, 20)).toBe(10)
      expect(clamp(20, 10, 20)).toBe(20)
    })
  })

  describe('lerp', () => {
    it('should linearly interpolate between values', () => {
      expect(lerp(0, 10, 0.5)).toBe(5)
      expect(lerp(0, 100, 0.25)).toBe(25)
    })

    it('should return start when t is 0', () => {
      expect(lerp(10, 20, 0)).toBe(10)
    })

    it('should return end when t is 1', () => {
      expect(lerp(10, 20, 1)).toBe(20)
    })
  })

  describe('mapRange', () => {
    it('should map value from one range to another', () => {
      expect(mapRange(50, 0, 100, 0, 10)).toBe(5)
      expect(mapRange(0, 0, 100, 0, 10)).toBe(0)
      expect(mapRange(100, 0, 100, 0, 10)).toBe(10)
    })
  })

  describe('distance', () => {
    it('should calculate Euclidean distance', () => {
      expect(distance(0, 0, 3, 4)).toBe(5)
      expect(distance(1, 1, 4, 5)).toBe(5)
    })
  })

  describe('percentage', () => {
    it('should calculate percentage', () => {
      expect(percentage(25, 100)).toBe(25)
      expect(percentage(1, 4)).toBe(25)
    })

    it('should handle zero total', () => {
      expect(percentage(10, 0)).toBe(0)
    })
  })
})

describe('Random', () => {
  describe('Random class', () => {
    let rng: Random

    beforeEach(() => {
      rng = new Random(12345)
    })

    it('should produce consistent results with same seed', () => {
      const value1 = rng.next()
      rng.reset()
      const value2 = rng.next()
      expect(value1).toBe(value2)
    })

    it('should produce values in range [0, 1)', () => {
      for (let i = 0; i < 100; i++) {
        const value = rng.next()
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(1)
      }
    })

    it('nextInt should produce integers in range [min, max)', () => {
      for (let i = 0; i < 100; i++) {
        const value = rng.nextInt(0, 10)
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(10)
        expect(Number.isInteger(value)).toBe(true)
      }
    })

    it('nextFloat should produce floats in range [min, max)', () => {
      for (let i = 0; i < 100; i++) {
        const value = rng.nextFloat(0, 10)
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(10)
      }
    })

    it('nextBool should produce correct distribution', () => {
      let trueCount = 0
      for (let i = 0; i < 10000; i++) {
        if (rng.nextBool()) trueCount++
      }
      expect(trueCount / 10000).toBeCloseTo(0.5, 0.05)
    })

    it('nextArrayItem should pick random element', () => {
      const array = ['a', 'b', 'c', 'd']
      const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 }
      
      for (let i = 0; i < 1000; i++) {
        const item = rng.nextArrayItem(array)
        counts[item]++
      }

      Object.values(counts).forEach(count => {
        expect(count).toBeGreaterThan(0)
        expect(count).toBeLessThan(1000)
      })
    })

    it('shuffle should randomize array', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = rng.shuffle(original)
      
      expect(shuffled).toHaveLength(5)
      expect(shuffled).toEqual(expect.arrayContaining(original))
      expect(shuffled).not.toEqual(original)
    })

    it('weightedRandom should respect weights', () => {
      const items = [
        { item: 'a', weight: 1 },
        { item: 'b', weight: 9 }
      ]
      
      const counts: Record<string, number> = { a: 0, b: 0 }
      for (let i = 0; i < 1000; i++) {
        const result = rng.weightedRandom(items)
        counts[result]++
      }

      expect(counts.a / counts.b).toBeLessThan(0.5)
    })
  })

  describe('Global random functions', () => {
    it('random should produce values in range [0, 1)', () => {
      for (let i = 0; i < 100; i++) {
        const value = random()
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(1)
      }
    })

    it('randomInt should produce integers', () => {
      for (let i = 0; i < 100; i++) {
        const value = randomInt(0, 100)
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(100)
        expect(Number.isInteger(value)).toBe(true)
      }
    })

    it('randomFloat should produce floats', () => {
      for (let i = 0; i < 100; i++) {
        const value = randomFloat(0, 100)
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(100)
      }
    })

    it('randomBool should produce booleans', () => {
      let trueCount = 0
      for (let i = 0; i < 1000; i++) {
        if (randomBool()) trueCount++
      }
      expect(trueCount).toBeGreaterThan(400)
      expect(trueCount).toBeLessThan(600)
    })

    it('shuffle should work globally', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffle(original)
      expect(shuffled).toHaveLength(5)
      expect(shuffled).toEqual(expect.arrayContaining(original))
    })

    it('weightedRandom should work globally', () => {
      const items = [
        { item: 'a', weight: 3 },
        { item: 'b', weight: 7 }
      ]
      
      const counts: Record<string, number> = { a: 0, b: 0 }
      for (let i = 0; i < 1000; i++) {
        const result = weightedRandom(items)
        counts[result]++
      }

      expect(counts.b / counts.a).toBeGreaterThan(2)
    })
  })
})
