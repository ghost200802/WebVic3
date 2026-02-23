import { Era, GoodsType, BuildingType } from '../models'

export function isGameDate(date: any): boolean {
  if (!date || typeof date !== 'object') return false
  if (typeof date.year !== 'number' || date.year < 0) return false
  if (typeof date.month !== 'number' || date.month < 1 || date.month > 12) return false
  if (typeof date.day !== 'number' || date.day < 1 || date.day > 30) return false
  return true
}

export function isEra(era: any): boolean {
  if (!era || typeof era !== 'string') return false
  return Object.values(Era).includes(era as Era)
}

export function isGoodsType(type: any): boolean {
  if (!type || typeof type !== 'string') return false
  return Object.values(GoodsType).includes(type as GoodsType)
}

export function isBuildingType(type: any): boolean {
  if (!type || typeof type !== 'string') return false
  return Object.values(BuildingType).includes(type as BuildingType)
}

export function isPositiveNumber(value: any): boolean {
  return typeof value === 'number' && value > 0
}

export function isNonNegativeNumber(value: any): boolean {
  return typeof value === 'number' && value >= 0
}

export function isPercentage(value: any): boolean {
  if (typeof value !== 'number') return false
  return value >= 0 && value <= 100
}

export function isString(value: any): boolean {
  return typeof value === 'string' && value.length > 0
}

export function isArray(value: any): boolean {
  return Array.isArray(value)
}

export function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isMap(value: any): boolean {
  return value instanceof Map
}

export function isSet(value: any): boolean {
  return value instanceof Set
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateGameState(state: any): ValidationResult {
  const errors: string[] = []

  if (!isObject(state)) {
    errors.push('GameState must be an object')
    return { valid: false, errors }
  }

  if (!isString(state.id)) {
    errors.push('GameState must have a valid id')
  }

  if (!isString(state.name)) {
    errors.push('GameState must have a valid name')
  }

  if (!isString(state.version)) {
    errors.push('GameState must have a valid version')
  }

  if (!isGameDate(state.date)) {
    errors.push('GameState must have a valid date')
  }

  if (!isEra(state.era)) {
    errors.push('GameState must have a valid era')
  }

  if (typeof state.tickCount !== 'number' || state.tickCount < 0) {
    errors.push('GameState must have a valid tickCount')
  }

  if (!isMap(state.tiles)) {
    errors.push('GameState tiles must be a Map')
  }

  if (!isMap(state.buildings)) {
    errors.push('GameState buildings must be a Map')
  }

  if (!isMap(state.populations)) {
    errors.push('GameState populations must be a Map')
  }

  if (!isMap(state.markets)) {
    errors.push('GameState markets must be a Map')
  }

  if (!isSet(state.technologies)) {
    errors.push('GameState technologies must be a Set')
  }

  if (!isObject(state.resources)) {
    errors.push('GameState resources must be an object')
    return { valid: false, errors }
  }

  if (typeof state.resources.money !== 'number' || state.resources.money < 0) {
    errors.push('GameState must have a valid money amount')
  }

  if (!isMap(state.resources.goods)) {
    errors.push('GameState goods must be a Map')
  }

  if (!isObject(state.settings)) {
    errors.push('GameState must have settings')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function validateRange(value: any, min: number, max: number, fieldName: string = 'value'): ValidationResult {
  const errors: string[] = []

  if (typeof value !== 'number') {
    errors.push(`${fieldName} must be a number`)
    return { valid: false, errors }
  }

  if (value < min) {
    errors.push(`${fieldName} must be at least ${min}`)
  }

  if (value > max) {
    errors.push(`${fieldName} must be at most ${max}`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
