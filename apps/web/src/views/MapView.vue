<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white mb-6">
      地图
    </h1>
    <div class="bg-slate-800 rounded-lg p-8 text-center">
      <p class="text-slate-400 mb-4">
        地图视图
      </p>
      <p class="text-slate-300">
        点击地块查看详情，拖拽平移，滚轮缩放
      </p>
      <div class="mt-8 grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        <div
          v-for="i in 16"
          :key="i"
          class="bg-green-700 h-32 rounded-lg hover:bg-green-600 cursor-pointer transition-colors flex items-center justify-center"
        >
          <span class="text-white font-bold">{{ i }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
