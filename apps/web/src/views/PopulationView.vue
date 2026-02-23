<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white mb-6">人口管理</h1>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">人口群体</h2>
        <div class="space-y-2">
          <div
            v-for="pop in populations"
            :key="pop.id"
            class="bg-slate-700 rounded p-3"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium text-white">{{ pop.name }}</span>
              <span class="text-slate-400 text-sm">{{ getLivingStandard(pop.standardOfLiving) }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-sm text-slate-300">
              <div>
                <p class="text-slate-400">人口</p>
                <p class="font-mono">{{ pop.totalPopulation.toLocaleString() }}</p>
              </div>
              <div>
                <p class="text-slate-400">就业</p>
                <p class="font-mono text-green-400">{{ pop.employedPopulation.toLocaleString() }}</p>
              </div>
              <div>
                <p class="text-slate-400">工资</p>
                <p class="font-mono">¥{{ pop.wage.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">人口统计</h2>
        <div class="space-y-4">
          <div>
            <p class="text-slate-400 mb-2">总人口</p>
            <p class="text-3xl font-bold text-white">{{ population.toLocaleString() }}</p>
          </div>
          <div>
            <p class="text-slate-400 mb-2">就业人口</p>
            <p class="text-3xl font-bold text-green-400">{{ employedPopulation.toLocaleString() }}</p>
          </div>
          <div>
            <p class="text-slate-400 mb-2">就业率</p>
            <div class="bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                class="bg-green-500 h-full transition-all"
                :style="{ width: employmentRate + '%' }"
              ></div>
            </div>
            <p class="text-right text-white font-mono mt-1">{{ employmentRate.toFixed(1) }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

const populations = computed(() => gameStore.populations)
const population = computed(() => gameStore.population)
const employedPopulation = computed(() => gameStore.employedPopulation)

const employmentRate = computed(() => {
  if (population.value === 0) return 0
  return (employedPopulation.value / population.value) * 100
})

const getLivingStandard = (level: string) => {
  const labels: Record<string, string> = {
    poor: '贫困',
    low: '低',
    medium: '中等',
    good: '良好',
    excellent: '优秀',
    high: '高'
  }
  return labels[level] || level
}
</script>
