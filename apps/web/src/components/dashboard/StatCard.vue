<template>
  <div class="bg-slate-800 rounded-lg p-4">
    <div class="flex items-center space-x-3">
      <span class="text-3xl">{{ icon }}</span>
      <div>
        <p class="text-slate-400 text-sm">{{ label }}</p>
        <p class="text-white text-2xl font-bold">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  label: string
  value: string | number
}

defineProps<Props>()
</script>
