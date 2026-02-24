<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white mb-6">
      设置
    </h1>
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="bg-slate-800 rounded-lg p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          游戏设置
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-slate-300 mb-2">游戏难度</label>
            <select
              v-model="settings.difficulty"
              class="w-full bg-slate-700 text-white p-2 rounded border border-slate-600"
              @change="saveSettings"
            >
              <option value="easy">
                简单
              </option>
              <option value="normal">
                普通
              </option>
              <option value="hard">
                困难
              </option>
            </select>
          </div>
          <div>
            <label class="block text-slate-300 mb-2">游戏速度</label>
            <select
              v-model="settings.gameSpeed"
              class="w-full bg-slate-700 text-white p-2 rounded border border-slate-600"
              @change="saveSettings"
            >
              <option :value="0.5">
                极慢
              </option>
              <option :value="1">
                慢速
              </option>
              <option :value="2">
                正常
              </option>
              <option :value="4">
                快速
              </option>
              <option :value="8">
                极快
              </option>
            </select>
          </div>
          <div>
            <label class="block text-slate-300 mb-2">自动保存间隔（分钟）</label>
            <input
              v-model.number="settings.autoSaveInterval"
              type="number"
              min="1"
              max="60"
              class="w-full bg-slate-700 text-white p-2 rounded border border-slate-600"
              @change="saveSettings"
            >
          </div>
        </div>
      </div>

      <div class="bg-slate-800 rounded-lg p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          界面设置
        </h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-slate-300">启用通知</label>
            <button
              class="w-12 h-6 rounded-full transition-colors relative"
              :class="settings.notifications ? 'bg-blue-600' : 'bg-slate-600'"
              @click="toggleNotifications"
            >
              <div
                class="w-5 h-5 rounded-full absolute transition-transform bg-white"
                :class="settings.notifications ? 'translate-x-6' : 'translate-x-0.5'"
              />
            </button>
          </div>
          <div class="flex items-center justify-between">
            <label class="text-slate-300">启用音效</label>
            <button
              class="w-12 h-6 rounded-full transition-colors relative"
              :class="settings.soundEnabled ? 'bg-blue-600' : 'bg-slate-600'"
              @click="toggleSound"
            >
              <div
                class="w-5 h-5 rounded-full absolute transition-transform bg-white"
                :class="settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'"
              />
            </button>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 rounded-lg p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          存档管理
        </h2>
        <div class="space-y-4">
          <button
            class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
            @click="saveGame"
          >
            保存游戏
          </button>
          <button
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            @click="loadGame"
          >
            加载存档
          </button>
          <button
            class="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg transition-colors"
            @click="exportGame"
          >
            导出存档
          </button>
          <button
            class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
            @click="resetGame"
          >
            重置游戏
          </button>
        </div>
      </div>

      <div class="flex space-x-4">
        <button
          class="bg-slate-600 hover:bg-slate-700 text-white py-2 px-6 rounded-lg transition-colors"
          @click="resetSettings"
        >
          重置所有设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useSettings } from '../composables/useSettings'
import { useGame } from '../composables/useGame'
import { getSettings, updateSettings, resetSettings as resetSettingsState } from '../state/settings'

const settingsComposable = useSettings()
const game = useGame()

const settings = reactive({
  difficulty: settingsComposable.settings.value.difficulty,
  gameSpeed: settingsComposable.settings.value.gameSpeed,
  autoSaveInterval: settingsComposable.settings.value.autoSaveInterval,
  notifications: settingsComposable.settings.value.notifications,
  soundEnabled: settingsComposable.settings.value.soundEnabled
})

watch(() => settingsComposable.settings.value, (newSettings) => {
  Object.assign(settings, newSettings)
}, { deep: true })

const saveSettings = () => {
  updateSettings(settings)
}

const toggleNotifications = () => {
  settings.notifications = !settings.notifications
  saveSettings()
}

const toggleSound = () => {
  settings.soundEnabled = !settings.soundEnabled
  saveSettings()
}

const resetSettings = () => {
  if (confirm('确定要重置所有设置吗？')) {
    resetSettingsState()
    Object.assign(settings, getSettings())
  }
}

const saveGame = () => {
  const gameState = game.state.value
  if (!gameState) {
    alert('没有可保存的游戏')
    return
  }
  
  const saveData = JSON.stringify({
    gameState,
    buildings: game.buildings.value,
    populations: game.populations.value,
    alerts: game.alerts.value,
    settings: getSettings(),
    savedAt: new Date().toISOString()
  })
  
  localStorage.setItem('webvic3_save', saveData)
  game.addAlert('success', '游戏已保存', '存档已保存到本地存储')
}

const loadGame = () => {
  const saveData = localStorage.getItem('webvic3_save')
  if (!saveData) {
    alert('没有找到存档')
    return
  }
  
  try {
    const data = JSON.parse(saveData)
    updateSettings(data.settings)
    Object.assign(settings, data.settings)
    
    game.addAlert('success', '游戏已加载', '存档已从本地存储加载')
  } catch (e) {
    alert('加载存档失败')
  }
}

const exportGame = () => {
  const gameState = game.state.value
  if (!gameState) {
    alert('没有可导出的游戏')
    return
  }
  
  const saveData = JSON.stringify({
    gameState,
    buildings: game.buildings.value,
    populations: game.populations.value,
    alerts: game.alerts.value,
    settings: getSettings(),
    savedAt: new Date().toISOString()
  }, null, 2)
  
  const blob = new Blob([saveData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `webvic3_save_${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  game.addAlert('success', '游戏已导出', '存档已下载')
}

const resetGame = () => {
  if (confirm('确定要重置游戏吗？\n\n此操作将清空所有游戏进度，包括：\n- 建筑和人口\n- 资源和科技\n- 存档数据\n\n此操作不可恢复！')) {
    if (confirm('再次确认：真的要重置游戏吗？')) {
      localStorage.removeItem('webvic3_save')
      game.reset()
      resetSettingsState()
      Object.assign(settings, getSettings())
      
      game.addAlert('info', '游戏已重置', '所有游戏数据已清空')
      
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    }
  }
}
</script>
