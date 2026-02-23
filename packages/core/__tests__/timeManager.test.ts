import { TimeManager, TimeConfig, createGameDate } from '../src'

describe('TimeManager', () => {
  let timeManager: TimeManager
  const initialDate = createGameDate(2024, 1, 1)
  const config: TimeConfig = {
    daysPerTick: 1,
    tickInterval: 1000
  }

  beforeEach(() => {
    timeManager = new TimeManager(initialDate, config)
  })

  describe('advance', () => {
    it('should advance by specified days', () => {
      timeManager.advance(5)
      const currentDate = timeManager.getCurrentDate()
      expect(currentDate.day).toBe(6)
    })

    it('should handle month overflow', () => {
      timeManager.advance(30)
      const currentDate = timeManager.getCurrentDate()
      expect(currentDate.day).toBe(1)
      expect(currentDate.month).toBe(2)
    })

    it('should handle year overflow', () => {
      timeManager.advance(365)
      const currentDate = timeManager.getCurrentDate()
      expect(currentDate.year).toBe(2025)
      expect(currentDate.month).toBe(1)
      expect(currentDate.day).toBe(6)
    })

    it('should not advance with zero days', () => {
      const initialDateCopy = timeManager.getCurrentDate()
      timeManager.advance(0)
      expect(timeManager.getCurrentDate()).toEqual(initialDateCopy)
    })

    it('should not advance with negative days', () => {
      const initialDateCopy = timeManager.getCurrentDate()
      timeManager.advance(-5)
      expect(timeManager.getCurrentDate()).toEqual(initialDateCopy)
    })
  })

  describe('getCurrentDate', () => {
    it('should return a copy of the date', () => {
      const date1 = timeManager.getCurrentDate()
      const date2 = timeManager.getCurrentDate()
      expect(date1).toEqual(date2)
      expect(date1).not.toBe(date2)
    })
  })

  describe('getTickCount', () => {
    it('should start at 0', () => {
      expect(timeManager.getTickCount()).toBe(0)
    })

    it('should increment with each advance', () => {
      timeManager.advance(1)
      expect(timeManager.getTickCount()).toBe(1)
      
      timeManager.advance(1)
      expect(timeManager.getTickCount()).toBe(2)
    })
  })

  describe('subscribe', () => {
    it('should call listeners when time advances', () => {
      const listener = jest.fn()
      timeManager.subscribe(listener)
      
      timeManager.advance(1)
      
      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          year: 2024,
          month: 1,
          day: 2
        })
      )
    })

    it('should return unsubscribe function', () => {
      const listener = jest.fn()
      const unsubscribe = timeManager.subscribe(listener)
      
      unsubscribe()
      timeManager.advance(1)
      
      expect(listener).not.toHaveBeenCalled()
    })
  })
})
