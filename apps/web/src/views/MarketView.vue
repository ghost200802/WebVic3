<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white mb-6">
      市场
    </h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">
          地块选择
        </h2>
        <p class="text-slate-400 text-sm mb-4">
          选择地块以查看该地块的商品价格。
        </p>
        <select
          v-model="selectedTileId"
          class="w-full bg-slate-600 text-white text-sm rounded px-3 py-2 border border-slate-500 focus:border-blue-500 focus:outline-none"
        >
          <option
            v-for="tile in tiles"
            :key="tile.id"
            :value="tile.id"
          >
            {{ tile.name }}
          </option>
        </select>
      </div>

      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">
          商品价格
        </h2>
        <p class="text-slate-400 text-sm mb-4">
          价格根据{{ selectedTile?.name }}库存动态调整。库存越低，价格越高。
        </p>
        <div class="space-y-2">
          <div
            v-for="good in goods"
            :key="good.id"
            class="flex justify-between items-center p-3 bg-slate-700 rounded"
          >
            <div>
              <span class="text-white font-medium">{{ good.name }}</span>
              <span class="text-slate-400 text-sm ml-2">基准价格: ¥{{ good.basePrice }}</span>
            </div>
            <div class="text-right">
              <div class="text-white font-mono">¥{{ good.currentPrice.toFixed(2) }}</div>
              <div class="text-xs text-slate-400">
                库存: {{ good.inventory }} / {{ good.capacity }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">
          价格机制说明
        </h2>
        <div class="text-slate-300 text-sm space-y-3">
          <p>
            价格根据库存占比动态调整，每个地块独立计算：
          </p>
          <ul class="list-disc list-inside space-y-1 text-slate-400">
            <li>库存 0%-20%: 价格 1.0x → 5.0x（库存极度稀缺）</li>
            <li>库存 20%-50%: 价格 1.0x → 1.5x（库存不足）</li>
            <li>库存 50%: 价格 1.0x（库存平衡）</li>
            <li>库存 50%-80%: 价格 1.0x → 0.67x（库存充裕）</li>
            <li>库存 80%-100%: 价格 0.67x → 0.2x（库存过剩）</li>
          </ul>
          <p class="text-yellow-400">
            注意：玩家无法手动买卖物品，价格仅用于生产计算。
          </p>
        </div>
      </div>

      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">
          {{ selectedTile?.name }}库存
        </h2>
        <div class="space-y-2">
          <div
            v-for="(amount, goodsId) in selectedTileStorage"
            :key="goodsId"
            class="flex justify-between items-center text-sm"
          >
            <span class="text-slate-300">{{ getGoodsName(goodsId) }}</span>
            <span class="text-white font-medium">{{ amount }}</span>
          </div>
          <div
            v-if="Object.keys(selectedTileStorage).length === 0"
            class="text-slate-400 text-center py-4"
          >
            空仓
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGame } from '../composables/useGame'
import { GOODS_CONFIG } from '@webvic3/core'

const game = useGame()
const selectedTileId = ref('tile_1')

const tiles = computed(() => {
  return Array.from(game.state.value?.tiles.values() || [])
})

const selectedTile = computed(() => {
  return tiles.value.find(t => t.id === selectedTileId.value)
})

const selectedTileStorage = computed(() => {
  const storage: Record<string, number> = {}
  if (selectedTile.value?.storage) {
    selectedTile.value.storage.forEach((value, key) => {
      storage[key] = value
    })
  }
  return storage
})

const goods = computed(() => {
  const state = game.state.value
  if (!state || !selectedTile.value) {
    return Object.entries(GOODS_CONFIG).map(([id, config]) => ({
      id,
      name: config.name,
      basePrice: config.basePrice,
      currentPrice: config.basePrice,
      inventory: 0,
      capacity: 1000
    }))
  }

  const tileStorage = selectedTile.value.storage
  const defaultCapacity = 1000

  return Object.entries(GOODS_CONFIG).map(([id, config]) => {
    const inventory = tileStorage.get(id) || 0
    const ratio = Math.min(1, Math.max(0, inventory / defaultCapacity))
    let multiplier = 1

    if (ratio <= 0.2) {
      multiplier = ratio <= 0 ? 5 : 1 + (ratio - 0.2) / 0.2 * 4
    } else if (ratio <= 0.5) {
      multiplier = 1 + (0.5 - ratio) / 0.3 * 0.5
    } else if (ratio <= 0.8) {
      multiplier = 1 - (ratio - 0.5) / 0.3 * 0.33
    } else {
      multiplier = 0.67 - (ratio - 0.8) / 0.2 * 0.47
    }

    return {
      id,
      name: config.name,
      basePrice: config.basePrice,
      currentPrice: config.basePrice * multiplier,
      inventory,
      capacity: defaultCapacity
    }
  })
})

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
