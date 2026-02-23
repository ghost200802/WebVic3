import { GameDate } from '../../models'

export interface TimeConfig {
  daysPerTick: number
  tickInterval: number
}

export interface ITimeManager {
  advance(days: number): void
  getCurrentDate(): GameDate
  getTickCount(): number
  subscribe(listener: (date: GameDate) => void): () => void
}

export class TimeManager implements ITimeManager {
  private currentDate: GameDate
  private tickCount: number
  private listeners: Set<(date: GameDate) => void>

  constructor(initialDate: GameDate, _config: TimeConfig) {
    this.currentDate = { ...initialDate }
    this.tickCount = 0
    this.listeners = new Set()
  }

  advance(days: number): void {
    if (days <= 0) return

    this.currentDate.day += days

    while (this.currentDate.day > 30) {
      this.currentDate.day -= 30
      this.currentDate.month += 1

      if (this.currentDate.month > 12) {
        this.currentDate.month = 1
        this.currentDate.year += 1
      }
    }

    this.tickCount += 1
    this.notifyListeners()
  }

  getCurrentDate(): GameDate {
    return { ...this.currentDate }
  }

  getTickCount(): number {
    return this.tickCount
  }

  subscribe(listener: (date: GameDate) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    const currentDateCopy = this.getCurrentDate()
    this.listeners.forEach(listener => {
      try {
        listener(currentDateCopy)
      } catch (error) {
        console.error('Error in time listener:', error)
      }
    })
  }
}
