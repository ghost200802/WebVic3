<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white mb-6">
      生产管理
    </h1>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">
          建筑列表
        </h2>
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
            <div class="flex justify-between text-sm text-slate-300 mb-2">
              <span>工人: {{ building.workers }}/{{ building.maxWorkers * building.count }}</span>
              <span>产量: {{ Math.round(calculateOutput(building)) }}/天</span>
            </div>
            <div class="mb-2">
              <label class="block text-sm text-slate-400 mb-2">调整工人</label>
              <div class="flex items-center gap-2">
                <input
                  type="range"
                  :min="0"
                  :max="building.maxWorkers * building.count"
                  :value="building.workers"
                  @input="updateWorkers(building, parseInt($event.target.value))"
                  class="flex-1 accent-blue-600"
                />
                <span class="text-sm text-white w-12 text-right">{{ building.workers }}</span>
              </div>
            </div>
            <div v-if="getAvailableProductionMethods(building).length > 0" class="mt-3 pt-3 border-t border-slate-600">
              <label class="block text-sm text-slate-400 mb-2">生产方式</label>
              <select
                :value="building.productionMethods[0]"
                @change="setProductionMethod(building, $event.target.value)"
                class="w-full bg-slate-600 text-white text-sm rounded px-3 py-2 border border-slate-500 focus:border-blue-500 focus:outline-none"
              >
                <option
                  v-for="method in getAvailableProductionMethods(building)"
                  :key="method.id"
                  :value="method.id"
                >
                  {{ method.name }} (效率: {{ Math.round(method.workerEfficiency * 100) }}%)
                </option>
              </select>
            </div>
          </div>
          <div
            v-if="buildings.length === 0"
            class="text-slate-400 text-center py-8"
          >
            暂无建筑，请在右侧建造新建筑
          </div>
        </div>
      </div>

      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">
          建设面板
        </h2>
        <div class="space-y-3">
          <button
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            @click="addBuilding(BuildingType.FORESTRY)"
          >
            + 新建林场
          </button>
          <button
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            @click="addBuilding(BuildingType.FARM)"
          >
            + 新建农场
          </button>
          <button
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            @click="addBuilding(BuildingType.QUARRY)"
          >
            + 新建矿场
          </button>
          <button
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            @click="addBuilding(BuildingType.RANCH)"
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
import { useGame } from '../composables/useGame'
import { BuildingType, PRODUCTION_METHODS } from '@webvic3/core'

const game = useGame()

const buildings = computed(() => game.buildings.value)

const addBuilding = (type: BuildingType) => {
  game.createBuilding(type)
}

const getAvailableProductionMethods = (building: any) => {
  const methods = []
  for (const methodId of building.productionMethods) {
    if (PRODUCTION_METHODS[methodId]) {
      methods.push(PRODUCTION_METHODS[methodId])
    }
  }
  return methods
}

const updateWorkers = (building: any, workers: number) => {
  game.updateBuildingWorkers(building.type, workers)
}

const setProductionMethod = (building: any, methodId: string) => {
  game.updateProductionMethod(building.id, methodId)
}

const calculateOutput = (building: any) => {
  const method = PRODUCTION_METHODS[building.productionMethods[0]]
  const methodEfficiency = method ? method.workerEfficiency : 1.0
  const workerRatio = building.baseWorkers > 0 ? building.workers / (building.baseWorkers * building.count) : 0
  return building.baseThroughput * building.count * workerRatio * building.efficiency * methodEfficiency
}
</script>
