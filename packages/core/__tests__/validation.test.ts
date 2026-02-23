import {
  isGameDate,
  isEra,
  isGoodsType,
  isPositiveNumber,
  isPercentage,
  isString,
  isArray,
  isObject,
  isMap,
  isSet,
  validateRange,
  validateGameState
} from '../src'

import { Era, createGameDate, GameDate, GoodsType } from '../src'

describe('Validation Utils', () => {
  describe('isGameDate', () => {
    it('should return true for valid date', () => {
      const date = createGameDate(2024, 1, 1)
      expect(isGameDate(date)).toBe(true)
    })

    it('should return false for null', () => {
      expect(isGameDate(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isGameDate(undefined)).toBe(false)
    })

    it('should return false for invalid year', () => {
      const invalidDate: any = { year: -1, month: 1, day: 1 }
      expect(isGameDate(invalidDate)).toBe(false)
    })

    it('should return false for invalid month', () => {
      const invalidDate: any = { year: 2024, month: 13, day: 1 }
      expect(isGameDate(invalidDate)).toBe(false)
    })

    it('should return false for invalid day', () => {
      const invalidDate: any = { year: 2024, month: 1, day: 31 }
      expect(isGameDate(invalidDate)).toBe(false)
    })
  })

  describe('isEra', () => {
    it('should return true for valid eras', () => {
      expect(isEra(Era.STONE_AGE)).toBe(true)
      expect(isEra(Era.INDUSTRIAL)).toBe(true)
      expect(isEra(Era.AI_AGE)).toBe(true)
    })

    it('should return false for invalid era', () => {
      expect(isEra('invalid_era')).toBe(false)
    })

    it('should return false for null', () => {
      expect(isEra(null)).toBe(false)
    })
  })

  describe('isGoodsType', () => {
    it('should return true for valid goods types', () => {
      expect(isGoodsType(GoodsType.RAW_MATERIAL)).toBe(true)
      expect(isGoodsType(GoodsType.LUXURY)).toBe(true)
    })

    it('should return false for invalid type', () => {
      expect(isGoodsType('invalid_type')).toBe(false)
    })
  })

  describe('isPositiveNumber', () => {
    it('should return true for positive numbers', () => {
      expect(isPositiveNumber(1)).toBe(true)
      expect(isPositiveNumber(0.5)).toBe(true)
      expect(isPositiveNumber(100)).toBe(true)
    })

    it('should return false for zero', () => {
      expect(isPositiveNumber(0)).toBe(false)
    })

    it('should return false for negative numbers', () => {
      expect(isPositiveNumber(-1)).toBe(false)
      expect(isPositiveNumber(-0.5)).toBe(false)
    })

    it('should return false for non-numbers', () => {
      expect(isPositiveNumber('1')).toBe(false)
      expect(isPositiveNumber(null)).toBe(false)
    })
  })

  describe('isPercentage', () => {
    it('should return true for valid percentages', () => {
      expect(isPercentage(0)).toBe(true)
      expect(isPercentage(50)).toBe(true)
      expect(isPercentage(100)).toBe(true)
    })

    it('should return false for negative values', () => {
      expect(isPercentage(-1)).toBe(false)
    })

    it('should return false for values over 100', () => {
      expect(isPercentage(101)).toBe(false)
    })
  })

  describe('isString', () => {
    it('should return true for non-empty strings', () => {
      expect(isString('hello')).toBe(true)
      expect(isString('a')).toBe(true)
    })

    it('should return false for empty string', () => {
      expect(isString('')).toBe(false)
    })

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false)
      expect(isString(null)).toBe(false)
    })
  })

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
    })

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false)
      expect(isArray(null)).toBe(false)
    })
  })

  describe('isObject', () => {
    it('should return true for plain objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ a: 1 })).toBe(true)
    })

    it('should return false for arrays', () => {
      expect(isObject([])).toBe(false)
    })

    it('should return false for null', () => {
      expect(isObject(null)).toBe(false)
    })
  })

  describe('isMap', () => {
    it('should return true for Maps', () => {
      expect(isMap(new Map())).toBe(true)
      expect(isMap(new Map([['a', 1]]))).toBe(true)
    })

    it('should return false for non-Maps', () => {
      expect(isMap({})).toBe(false)
      expect(isMap([])).toBe(false)
    })
  })

  describe('isSet', () => {
    it('should return true for Sets', () => {
      expect(isSet(new Set())).toBe(true)
      expect(isSet(new Set([1, 2, 3]))).toBe(true)
    })

    it('should return false for non-Sets', () => {
      expect(isSet([])).toBe(false)
      expect(isSet({})).toBe(false)
    })
  })

  describe('validateRange', () => {
    it('should return valid for values in range', () => {
      const result = validateRange(5, 0, 10)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return invalid for values below min', () => {
      const result = validateRange(-5, 0, 10)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should return invalid for values above max', () => {
      const result = validateRange(15, 0, 10)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should return invalid for non-numbers', () => {
      const result = validateRange('5' as any, 0, 10)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('validateGameState', () => {
    it('should return valid for minimal valid state', () => {
      const state: any = {
        id: 'test',
        name: 'Test Game',
        version: '1.0.0',
        date: createGameDate(2024, 1, 1),
        era: Era.STONE_AGE,
        tickCount: 0,
        tiles: new Map(),
        buildings: new Map(),
        populations: new Map(),
        markets: new Map(),
        technologies: new Set(),
        researchQueue: {
          current: null,
          queue: [],
          researchSpeed: 1
        },
        resources: {
          money: 1000,
          goods: new Map()
        },
        settings: {
          gameSpeed: 1,
          autoSaveInterval: 300,
          difficulty: 'normal',
          enabledFeatures: {
            events: true,
            disasters: true,
            wars: true,
            trade: true
          }
        }
      }
      
      const result = validateGameState(state)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return invalid for state with missing fields', () => {
      const state: any = {
        id: 'test',
        name: 'Test Game'
      }
      
      const result = validateGameState(state)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })
})
