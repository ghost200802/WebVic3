<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white mb-6">
      市场
    </h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">
          商品价格
        </h2>
        <div class="space-y-2">
          <div
            v-for="good in goods"
            :key="good.id"
            class="flex justify-between items-center p-3 bg-slate-700 rounded"
          >
            <div>
              <span class="text-white font-medium">{{ good.name }}</span>
              <span class="text-green-400 text-sm ml-2">+{{ good.change }}%</span>
            </div>
            <span class="text-white font-mono">¥{{ good.price.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">
          交易面板
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-slate-300 mb-2">选择商品</label>
            <select
              v-model="selectedGood"
              class="w-full bg-slate-700 text-white p-2 rounded border border-slate-600"
            >
              <option
                v-for="good in goods"
                :key="good.id"
                :value="good.id"
              >
                {{ good.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-slate-300 mb-2">数量</label>
            <input
              v-model.number="tradeAmount"
              type="number"
              min="1"
              class="w-full bg-slate-700 text-white p-2 rounded border border-slate-600"
              placeholder="输入数量"
            >
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button
              class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
              @click="buyGood"
            >
              买入
            </button>
            <button
              class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
              @click="sellGood"
            >
              卖出
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGame } from '../composables/useGame'

const game = useGame()

const selectedGood = ref('food')
const tradeAmount = ref(10)

const goods = [
  { id: 'food', name: '粮食', price: 10, change: 2.5 },
  { id: 'wood', name: '木材', price: 15, change: -1.2 },
  { id: 'stone', name: '石头', price: 8, change: 0.8 },
  { id: 'iron', name: '钢铁', price: 50, change: 5.3 }
]

const buyGood = () => {
  if (tradeAmount.value <= 0) return
  game.purchaseGood(selectedGood.value, tradeAmount.value)
}

const sellGood = () => {
  if (tradeAmount.value <= 0) return
  game.sellGood(selectedGood.value, tradeAmount.value)
}
</script>
