export class Random {
  private seed: number
  private currentSeed: number

  constructor(seed?: number) {
    this.seed = seed !== undefined ? seed : Date.now()
    this.currentSeed = this.seed
  }

  next(): number {
    this.currentSeed = (this.currentSeed * 9301 + 49297) % 233280
    return this.currentSeed / 233280
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min
  }

  nextBool(probability: number = 0.5): boolean {
    return this.next() < probability
  }

  nextArrayItem<T>(array: T[]): T {
    return array[this.nextInt(0, array.length)]
  }

  nextArrayItems<T>(array: T[], count: number): T[] {
    const shuffled = this.shuffle([...array])
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1)
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  weightedRandom<T>(items: { item: T; weight: number }[]): T {
    if (items.length === 0) {
      throw new Error('Cannot pick from empty array')
    }

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
    let random = this.next() * totalWeight

    for (const item of items) {
      random -= item.weight
      if (random <= 0) {
        return item.item
      }
    }

    return items[items.length - 1].item
  }

  reset(): void {
    this.currentSeed = this.seed
  }
}

export const defaultRandom = new Random()

export function random(): number {
  return defaultRandom.next()
}

export function randomInt(min: number, max: number): number {
  return defaultRandom.nextInt(min, max)
}

export function randomFloat(min: number, max: number): number {
  return defaultRandom.nextFloat(min, max)
}

export function randomBool(probability: number = 0.5): boolean {
  return defaultRandom.nextBool(probability)
}

export function randomArrayItem<T>(array: T[]): T {
  return defaultRandom.nextArrayItem(array)
}

export function shuffle<T>(array: T[]): T[] {
  return defaultRandom.shuffle(array)
}

export function weightedRandom<T>(items: { item: T; weight: number }[]): T {
  return defaultRandom.weightedRandom(items)
}
