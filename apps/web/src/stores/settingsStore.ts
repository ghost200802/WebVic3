import { defineStore } from 'pinia'

export interface GameSettings {
  autoSaveInterval: number
  autoSaveCount: number
  difficulty: 'easy' | 'normal' | 'hard'
  gameSpeed: number
  notifications: boolean
  soundEnabled: boolean
}

export const useSettingsStore = defineStore('settings', {
  state: (): GameSettings => ({
    autoSaveInterval: 5,
    autoSaveCount: 3,
    difficulty: 'normal',
    gameSpeed: 1,
    notifications: true,
    soundEnabled: false
  }),

  getters: {
    gameSpeedLabel(): string {
      const labels: Record<number, string> = {
        0.5: '极慢',
        1: '慢速',
        2: '正常',
        4: '快速',
        8: '极快'
      }
      return labels[this.gameSpeed] || '自定义'
    }
  },

  actions: {
    updateSettings(settings: Partial<GameSettings>) {
      Object.assign(this, settings)
    },

    resetSettings() {
      this.$reset()
    }
  }
})
