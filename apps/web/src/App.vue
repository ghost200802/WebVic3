<template>
  <div id="app">
    <router-view v-if="isReady" />
    <div v-else class="flex items-center justify-center h-screen">
      <div class="text-white text-xl">加载中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGame } from './composables/useGame'

const game = useGame()
const isReady = ref(false)

onMounted(() => {
  if (!game.state.value) {
    game.initGame()
  }
  isReady.value = true
  game.startTicking()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
}
</style>
