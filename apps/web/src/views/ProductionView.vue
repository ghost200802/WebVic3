<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white mb-6">生产管理</h1>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">建筑列表</h2>
        <div class="space-y-2">
          <div
            v-for="building in buildings"
            :key="building.id"
            class="bg-slate-700 rounded p-3"
          >
            <div class="flex justify-between items-center mb-2">
              <div class="flex items-center gap-2">
                <span class="font-medium text-white">{{ building.name }}</span>
                <span class="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">x{{ building.count }}</span>
              </div>
              <span class="text-slate-400 text-sm">效率: {{ Math.round(building.efficiency * 100) }}%</span>
            </div>
            <div class="flex justify-between text-sm text-slate-300">
              <span>工人: {{ building.workers }}/{{ building.maxWorkers * building.count }}</span>
              <span>产量: {{ Math.round(building.baseThroughput * building.count * building.efficiency) }}/天</span>
            </div>
          </div>
          <div v-if="buildings.length === 0" class="text-slate-400 text-center py-8">
            暂无建筑，请在右侧建造新建筑
          </div>
        </div>
      </div>

      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">建设面板</h2>
        <div class="space-y-3">
          <button
            @click="addBuilding(BuildingType.FORESTRY)"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            + 新建林场
          </button>
          <button
            @click="addBuilding(BuildingType.FARM)"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            + 新建农场
          </button>
          <button
            @click="addBuilding(BuildingType.QUARRY)"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            + 新建矿场
          </button>
          <button
            @click="addBuilding(BuildingType.RANCH)"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            + 新建牧场
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { BuildingType } from '@webvic3/core'

const gameStore = useGameStore()

const buildings = computed(() => gameStore.buildings)

const addBuilding = (type: BuildingType) => {
  gameStore.addBuilding(type)
}
</script>
