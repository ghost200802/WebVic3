import { ref, computed, onUnmounted } from 'vue'
import { getSettings, updateSettings, resetSettings, subscribeSettings, type GameSettings } from '../state/settings'

export function useSettings() {
  const settings = ref<GameSettings>({ ...getSettings() })

  const unsubscribe = subscribeSettings((newSettings) => {
    settings.value = newSettings
  })

  onUnmounted(() => {
    unsubscribe()
  })

  const gameSpeedLabel = computed(() => {
    const speed = settings.value.gameSpeed
    const labels: Record<number, string> = {
      0.5: '极慢',
      1: '慢速',
      2: '正常',
      4: '快速',
      8: '极快'
    }
    return labels[speed] || '自定义'
  })

  const update = (updates: Partial<GameSettings>) => {
    updateSettings(updates)
  }

  const reset = () => {
    resetSettings()
  }

  return {
    settings,
    gameSpeedLabel,
    update,
    reset
  }
}
