<template>
  <div class="w-64 bg-slate-900 text-white h-screen flex flex-col">
    <div class="p-4 border-b border-slate-700">
      <h1 class="text-xl font-bold">WebVic3</h1>
      <p class="text-slate-400 text-sm mt-1">文明模拟游戏</p>
    </div>

    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.id">
          <router-link
            :to="item.route"
            class="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            :class="{ 'bg-slate-800 text-white': currentRoute === item.route }"
          >
            <span class="text-xl mr-3">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
            <span v-if="item.badge > 0" class="ml-auto bg-red-500 text-xs px-2 py-1 rounded-full">
              {{ item.badge }}
            </span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-slate-700">
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 rounded-full" :class="isPaused ? 'bg-amber-500' : 'bg-green-500'"></div>
        <span class="text-sm text-slate-400">{{ isPaused ? '已暂停' : '运行中' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '../../stores/gameStore'

const route = useRoute()
const gameStore = useGameStore()

const currentRoute = computed(() => route.path)
const isPaused = computed(() => gameStore.isPaused)
const alertCount = computed(() => gameStore.alerts.length)

const menuItems = computed(() => [
  { id: 'dashboard', label: '仪表盘', icon: '📊', route: '/', badge: alertCount.value },
  { id: 'map', label: '地图', icon: '🗺️', route: '/map' },
  { id: 'production', label: '生产', icon: '🏭', route: '/production' },
  { id: 'market', label: '市场', icon: '📈', route: '/market' },
  { id: 'population', label: '人口', icon: '👥', route: '/population' },
  { id: 'technology', label: '科技', icon: '🔬', route: '/technology' },
  { id: 'settings', label: '设置', icon: '⚙️', route: '/settings' }
])
</script>
