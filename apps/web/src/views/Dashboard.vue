<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white mb-6">仪表盘</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard icon="👥" label="人口" :value="population.toLocaleString()" />
      <StatCard icon="💰" label="资金" :value="'¥' + treasury.toLocaleString()" />
      <StatCard icon="🎯" label="时代" :value="era || '-'" />
      <StatCard icon="📅" label="日期" :value="formatDate" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">生产概况</h2>
        <div class="space-y-3">
          <div class="flex justify-between text-slate-300">
            <span>建筑总数</span>
            <span class="font-mono">{{ buildings.length }} 个</span>
          </div>
          <div class="flex justify-between text-slate-300">
            <span>林场效率</span>
            <span class="font-mono">{{ forestryEfficiency }}%</span>
          </div>
          <div class="flex justify-between text-slate-300">
            <span>农场效率</span>
            <span class="font-mono">{{ farmEfficiency }}%</span>
          </div>
          <div class="flex justify-between text-slate-300">
            <span>矿场效率</span>
            <span class="font-mono">{{ quarryEfficiency }}%</span>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">活跃事件</h2>
        <div class="space-y-2">
          <div
            v-for="alert in alerts"
            :key="alert.id"
            class="p-3 rounded-lg"
            :class="getAlertClass(alert.type)"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium">{{ alert.title }}</span>
              <button @click="removeAlert(alert.id)" class="text-white/70 hover:text-white">
                ✕
              </button>
            </div>
            <p class="text-sm mt-1 opacity-90">{{ alert.message }}</p>
          </div>
          <div v-if="alerts.length === 0" class="text-slate-400 text-center py-4">
            暂无事件
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { Era, BuildingType } from '@webvic3/core'
import StatCard from '../components/dashboard/StatCard.vue'

const gameStore = useGameStore()

const population = computed(() => gameStore.population)
const treasury = computed(() => gameStore.treasury)
const era = computed(() => {
  const eraValue = gameStore.era
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
const gameDate = computed(() => gameStore.gameDate)
const alerts = computed(() => gameStore.alerts)
const buildings = computed(() => gameStore.buildings)

const forestryEfficiency = computed(() => {
  const building = buildings.value.find(b => b.type === BuildingType.FORESTRY)
  return building ? Math.round(building.efficiency * 100) : 0
})

const farmEfficiency = computed(() => {
  const building = buildings.value.find(b => b.type === BuildingType.FARM)
  return building ? Math.round(building.efficiency * 100) : 0
})

const quarryEfficiency = computed(() => {
  const building = buildings.value.find(b => b.type === BuildingType.QUARRY)
  return building ? Math.round(building.efficiency * 100) : 0
})

const formatDate = computed(() => {
  if (!gameDate.value) return '-'
  const date = gameDate.value
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
})

const getAlertClass = (type: string) => {
  const classes: Record<string, string> = {
    info: 'bg-blue-600',
    warning: 'bg-amber-600',
    error: 'bg-red-600',
    success: 'bg-green-600'
  }
  return classes[type] || 'bg-slate-600'
}

const removeAlert = (id: string) => {
  gameStore.removeAlert(id)
}

onMounted(() => {
  if (!gameStore.gameState) {
    gameStore.initializeGame()
  }
  gameStore.startTicking()
})
</script>
