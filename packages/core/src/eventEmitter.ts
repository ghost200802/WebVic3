export interface GameEvent {
  type: string
  data?: any
  timestamp: number
}

export type EventHandler = (event: GameEvent) => void

export interface IGameEventEmitter {
  emit(event: GameEvent): void
  on(eventType: string, handler: EventHandler): void
  off(eventType: string, handler: EventHandler): void
  once(eventType: string, handler: EventHandler): void
  clear(eventType?: string): void
}

export class GameEventEmitter implements IGameEventEmitter {
  private listeners: Map<string, Set<EventHandler>>
  private eventQueue: GameEvent[]
  private processing: boolean

  constructor() {
    this.listeners = new Map()
    this.eventQueue = []
    this.processing = false
  }

  emit(event: GameEvent): void {
    this.eventQueue.push({
      ...event,
      timestamp: Date.now()
    })

    if (!this.processing) {
      this.processQueue()
    }
  }

  on(eventType: string, handler: EventHandler): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType)!.add(handler)
  }

  off(eventType: string, handler: EventHandler): void {
    const handlers = this.listeners.get(eventType)
    if (handlers) {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.listeners.delete(eventType)
      }
    }
  }

  once(eventType: string, handler: EventHandler): void {
    const onceHandler: EventHandler = (event: GameEvent) => {
      handler(event)
      this.off(eventType, onceHandler)
    }
    this.on(eventType, onceHandler)
  }

  clear(eventType?: string): void {
    if (eventType) {
      this.listeners.delete(eventType)
    } else {
      this.listeners.clear()
    }
  }

  private processQueue(): void {
    this.processing = true

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!
      this.dispatchEvent(event)
    }

    this.processing = false
  }

  private dispatchEvent(event: GameEvent): void {
    const handlers = this.listeners.get(event.type)
    if (!handlers) return

    handlers.forEach(handler => {
      try {
        handler(event)
      } catch (error) {
        console.error(`Error in event handler for "${event.type}":`, error)
      }
    })
  }
}
