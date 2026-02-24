<template>
  <div class="bg-slate-800 text-white px-6 py-3 flex items-center justify-between border-b border-slate-700">
    <div class="flex items-center space-x-6">
      <div class="flex items-center space-x-2">
        <span class="text-slate-400">📅</span>
        <span class="font-mono">{{ formatDate }}</span>
      </div>

      <div class="flex items-center space-x-2">
        <span class="text-slate-400">⏳</span>
        <span>Tick: {{ tickCount }}</span>
      </div>

      <div class="flex items-center space-x-2">
        <span class="text-slate-400">🎯</span>
        <span>{{ era }}</span>
      </div>

      <div class="flex items-center space-x-2">
        <span class="text-slate-400">👥</span>
        <span>{{ population.toLocaleString() }}</span>
      </div>

      <div class="flex items-center space-x-2">
        <span class="text-slate-400">💰</span>
        <span class="font-mono">¥{{ treasury.toLocaleString() }}</span>
      </div>
    </div>

    <div class="flex items-center space-x-4">
      <button
        class="px-4 py-2 rounded-lg font-medium transition-colors"
        :class="isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'"
        @click="togglePause"
      >
        {{ isPaused ? '▶ 继续' : '⏸ 暂停' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGame } from '../../composables/useGame'
import { Era } from '@webvic3/core'

const game = useGame()

const isPaused = computed(() => game.state.value?.isPaused ?? false)
const gameDate = computed(() => game.gameDate.value)
const era = computed(() => {
  const eraValue = game.era.value
  if (!eraValue) return '-'
  const eraLabels: Record<string, string> = {
    [Era.STONE_AGE]: '石器时代',
    [Era.BRONZE_AGE]: '青铜时代',
    [Era.IRON_AGE]: '铁器时代',
    [Era.CLASSICAL]: '古典时代',
    [Era.MEDIEVAL]: '中世纪',
    [Era.RENAISSANCE]: '文艺复兴',
    [Era.INDUSTRIAL]: '工业时代',
    [Era.ELECTRICAL]: '电气时代',
    [Era.INFORMATION]: '信息时代',
    [Era.AI_AGE]: 'AI时代'
  }
  return eraLabels[eraValue] || eraValue
})
const population = computed(() => game.population.value)
const treasury = computed(() => game.treasury.value)
const tickCount = computed(() => game.state.value?.tickCount || 0)

const formatDate = computed(() => {
  if (!gameDate.value) return '-'
  const date = gameDate.value
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
})

const togglePause = () => {
  if (isPaused.value) {
    game.resume()
  } else {
    game.pause()
  }
}
</script>
