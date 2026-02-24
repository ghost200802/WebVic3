<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white mb-6">
      生产管理
    </h1>
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
              <button
                @click="removeBuilding(building)"
                class="text-red-400 hover:text-red-300 text-sm"
              >
                拆除
              </button>
            </div>
            <div class="flex justify-between text-sm text-slate-300 mb-2">
              <span>工人: {{ building.workers }}/{{ building.maxWorkers }}</span>
              <span>产量: {{ Math.round(calculateOutput(building)) }}/天</span>
            </div>
            <div class="flex justify-between text-sm text-slate-300 mb-2">
              <span>效率: {{ Math.round(building.efficiency * 100) }}%</span>
            </div>
            <div class="mb-2">
              <label class="block text-sm text-slate-400 mb-2">调整工人</label>
              <div class="flex items-center gap-2">
                <input
                  type="range"
                  :min="0"
                  :max="building.maxWorkers"
                  :value="building.workers"
                  @input="updateWorkers(building, parseInt(($event.target as HTMLInputElement).value))"
                  class="flex-1 accent-blue-600"
                />
                <span class="text-sm text-white w-12 text-right">{{ building.workers }}</span>
              </div>
            </div>
            <div v-if="getAvailableProductionMethods(building).length > 0" class="mt-3 pt-3 border-t border-slate-600">
              <label class="block text-sm text-slate-400 mb-2">生产方式</label>
              <select
                :value="building.productionMethods[0]"
                @change="setProductionMethod(building, ($event.target as HTMLSelectElement).value)"
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
        <div class="mb-4">
          <label class="block text-sm text-slate-400 mb-2">选择地块</label>
          <select
            v-model="selectedTileId"
            class="w-full bg-slate-600 text-white text-sm rounded px-3 py-2 border border-slate-500 focus:border-blue-500 focus:outline-none"
          >
            <option
              v-for="tile in tiles"
              :key="tile.id"
              :value="tile.id"
            >
              {{ tile.name }} (可用: {{ tile.buildableArea - tile.usedArea }})
            </option>
          </select>
        </div>
        <div class="space-y-3">
          <button
            v-for="(config, key) in BUILDING_CONFIGS"
            :key="key"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            :disabled="!canBuildBuilding(config)"
            @click="addBuilding(config.type)"
          >
            + 新建{{ config.name }} (面积: {{ config.area }})
          </button>
        </div>
      </div>
      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">
          总库存
        </h2>
        <div class="space-y-2">
          <div
            v-for="(amount, goodsId) in globalStorage"
            :key="goodsId"
            class="flex justify-between items-center text-sm"
          >
            <span class="text-slate-300">{{ getGoodsName(goodsId) }}</span>
            <span class="text-white font-medium">{{ amount }}</span>
          </div>
          <div
            v-if="Object.keys(globalStorage).length === 0"
            class="text-slate-400 text-center py-4"
          >
            暂无库存
          </div>
        </div>
      </div>
      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">
          地块库存
        </h2>
        <div class="space-y-2">
          <div
            v-for="tile in tiles"
            :key="tile.id"
            class="bg-slate-700 rounded p-3"
          >
            <div class="font-medium text-white mb-2">{{ tile.name }}</div>
            <div class="space-y-1">
              <div
                v-for="(amount, goodsId) in tile.storage"
                :key="goodsId"
                class="flex justify-between text-xs text-slate-300"
              >
                <span>{{ getGoodsName(String(goodsId)) }}</span>
                <span>{{ amount }}</span>
              </div>
              <div
                v-if="tile.storage.size === 0"
                class="text-slate-400 text-xs text-center py-2"
              >
                空仓
              </div>
            </div>
          </div>
          <div
            v-if="tiles.length === 0"
            class="text-slate-400 text-center py-4"
          >
            暂无地块
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGame } from '../composables/useGame'
import { BuildingType, PRODUCTION_METHODS, BUILDING_CONFIGS, Era, ProductionCalculator } from '@webvic3/core'

const game = useGame()
const calculator = new ProductionCalculator()

const selectedTileId = ref('tile_1')

const buildings = computed(() => game.buildings.value)

const addBuilding = (type: BuildingType) => {
  game.createBuilding(type, selectedTileId.value)
}

const removeBuilding = (building: any) => {
  if (confirm(`确定要拆除这个${building.name}吗？`)) {
    game.removeBuilding(building.id)
  }
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
  if (!game.state.value) return 0
  
  return calculator.calculateDisplayOutput(
    building,
    game.state.value.era,
    2,
    1.0
  )
}

const globalStorage = computed(() => {
  const storage: Record<string, number> = {}
  if (game.state.value?.globalStorage) {
    game.state.value.globalStorage.forEach((value, key) => {
      storage[key] = value
    })
  }
  return storage
})

const tiles = computed(() => {
  return Array.from(game.state.value?.tiles.values() || [])
})

const canBuildBuilding = (config: any) => {
  const tile = game.state.value?.tiles.get(selectedTileId.value)
  if (!tile) return false
  return tile.usedArea + config.area <= tile.buildableArea
}

const getGoodsName = (goodsId: string) => {
  const names: Record<string, string> = {
    'food': '食物',
    'wood': '木材',
    'stone': '石料',
    'iron': '铁矿',
    'steel': '钢材',
    'coal': '煤炭',
    'wheat': '小麦',
    'livestock': '牲畜',
    'fish': '鱼类',
    'cloth': '布匹',
    'tools': '工具',
    'gold': '黄金',
    'gems': '宝石',
    'oil': '石油',
    'rubber': '橡胶'
  }
  return names[goodsId] || goodsId
}
</script>
