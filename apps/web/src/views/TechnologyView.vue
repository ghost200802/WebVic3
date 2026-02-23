<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white mb-6">科技研发</h1>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">科技树</h2>
        <div class="space-y-3">
          <div
            v-for="tech in technologies"
            :key="tech.id"
            class="bg-slate-700 rounded p-3"
            :class="{ 'border-2 border-blue-500': tech.status === 'researching' }"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium text-white">{{ tech.name }}</span>
              <span
                class="text-xs px-2 py-1 rounded"
                :class="getStatusClass(tech.status)"
              >
                {{ getStatusText(tech.status) }}
              </span>
            </div>
            <p class="text-sm text-slate-400 mb-2">{{ tech.description }}</p>
            <div v-if="tech.status === 'researching'" class="mb-2">
              <div class="flex justify-between text-sm text-slate-300 mb-1">
                <span>进度</span>
                <span class="font-mono">{{ tech.progress }}/{{ tech.cost }}</span>
              </div>
              <div class="bg-slate-600 rounded-full h-2 overflow-hidden">
                <div
                  class="bg-blue-500 h-full"
                  :style="{ width: (tech.progress / tech.cost * 100) + '%' }"
                ></div>
              </div>
            </div>
            <div class="text-sm text-slate-300">
              <span>成本: </span>
              <span class="font-mono">{{ tech.cost }} 研发点</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 rounded-lg p-4">
        <h2 class="text-lg font-bold text-white mb-4">研发队列</h2>
        <div class="space-y-3">
          <div
            v-for="tech in researchQueue"
            :key="tech.id"
            class="bg-blue-900 border border-blue-500 rounded p-3"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium text-white">{{ tech.name }}</span>
              <button
                @click="removeFromQueue(tech.id)"
                class="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <div v-if="tech.isCurrent" class="mb-2">
              <div class="flex justify-between text-sm text-slate-300 mb-1">
                <span>进度</span>
                <span class="font-mono">{{ Math.round(tech.progress / tech.cost * 100) }}%</span>
              </div>
              <div class="bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  class="bg-blue-500 h-full"
                  :style="{ width: (tech.progress / tech.cost * 100) + '%' }"
                ></div>
              </div>
            </div>
            <p v-if="tech.isCurrent" class="text-sm text-slate-400">
              预计完成: {{ tech.daysLeft }}天后
            </p>
          </div>
          <div v-if="researchQueue.length === 0" class="text-slate-400 text-center py-4 text-sm">
            研发队列为空
          </div>
          <div class="text-slate-400 text-center py-4 text-sm">
            研发速度: 1.0点/天
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

const techData = [
  { id: 'stone_tool', name: '石器制作', description: '学会制作石器，提高狩猎和采集效率', cost: 50 },
  { id: 'domestication', name: '驯化', description: '学会驯化动物，发展畜牧业', cost: 100 },
  { id: 'metal_smelting', name: '金属冶炼', description: '学会冶炼铜和锡，制造青铜器', cost: 200 },
  { id: 'iron_smelting', name: '铁器冶炼', description: '学会冶炼铁，制造铁器', cost: 300 }
]

const technologies = computed(() => {
  const queue = gameStore.gameState?.researchQueue
  const ownedTechs = gameStore.gameState?.technologies || new Set()
  
  return techData.map(tech => {
    let status = 'locked'
    let progress = 0
    
    if (ownedTechs.has(tech.id)) {
      status = 'completed'
    } else if (queue?.current?.tech === tech.id) {
      status = 'researching'
      progress = queue.current.progress
    } else if (queue?.queue.includes(tech.id)) {
      status = 'queued'
    } else if (tech.id === 'stone_tool' || ownedTechs.has('stone_tool')) {
      status = 'available'
    } else if (tech.id === 'domestication' || (ownedTechs.has('stone_tool'))) {
      status = 'available'
    } else if (tech.id === 'metal_smelting' && ownedTechs.has('domestication')) {
      status = 'available'
    } else if (tech.id === 'iron_smelting' && ownedTechs.has('metal_smelting')) {
      status = 'available'
    }
    
    return { ...tech, status, progress }
  })
})

const researchQueue = computed(() => {
  const queue = gameStore.gameState?.researchQueue
  if (!queue) return []
  
  const result = []
  
  if (queue.current) {
    const techInfo = techData.find(t => t.id === queue.current!.tech)
    if (techInfo) {
      result.push({
        ...techInfo,
        id: queue.current.tech,
        isCurrent: true,
        progress: queue.current.progress,
        daysLeft: Math.ceil((techInfo.cost - queue.current.progress) / queue.researchSpeed)
      })
    }
  }
  
  queue.queue.forEach((techId, index) => {
    const techInfo = techData.find(t => t.id === techId)
    if (techInfo) {
      result.push({
        ...techInfo,
        id: techId,
        isCurrent: false,
        progress: 0,
        daysLeft: index * techInfo.cost
      })
    }
  })
  
  return result
})

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    completed: 'bg-green-600',
    researching: 'bg-blue-600',
    queued: 'bg-amber-600',
    available: 'bg-slate-600',
    locked: 'bg-slate-800'
  }
  return classes[status] || 'bg-slate-600'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    completed: '已研究',
    researching: '研究进行中',
    queued: '队列中',
    available: '可研究',
    locked: '未解锁'
  }
  return texts[status] || status
}

const removeFromQueue = (techId: string) => {
  const queue = gameStore.gameState?.researchQueue
  if (!queue) return
  
  if (queue.current?.tech === techId) {
    return
  }
  
  const index = queue.queue.indexOf(techId)
  if (index !== -1) {
    queue.queue.splice(index, 1)
  }
}
</script>
