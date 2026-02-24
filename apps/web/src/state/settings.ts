export interface GameSettings {
  autoSaveInterval: number
  autoSaveCount: number
  difficulty: 'easy' | 'normal' | 'hard'
  gameSpeed: number
  notifications: boolean
  soundEnabled: boolean
}

let _settings: GameSettings = {
  autoSaveInterval: 5,
  autoSaveCount: 3,
  difficulty: 'normal',
  gameSpeed: 1,
  notifications: true,
  soundEnabled: false
}

const _listeners = new Set<(settings: GameSettings) => void>()

export const getSettings = (): GameSettings => {
  return { ..._settings }
}

export const updateSettings = (updates: Partial<GameSettings>): void => {
  _settings = { ..._settings, ...updates }
  notifyListeners()
}

export const resetSettings = (): void => {
  _settings = {
    autoSaveInterval: 5,
    autoSaveCount: 3,
    difficulty: 'normal',
    gameSpeed: 1,
    notifications: true,
    soundEnabled: false
  }
  notifyListeners()
}

export const subscribeSettings = (listener: (settings: GameSettings) => void): (() => void) => {
  _listeners.add(listener)
  return () => _listeners.delete(listener)
}

const notifyListeners = (): void => {
  for (const listener of _listeners) {
    listener({ ..._settings })
  }
}

export const getGameSpeedLabel = (speed: number): string => {
  const labels: Record<number, string> = {
    0.5: '极慢',
    1: '慢速',
    2: '正常',
    4: '快速',
    8: '极快'
  }
  return labels[speed] || '自定义'
}
