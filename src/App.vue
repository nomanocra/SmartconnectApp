<script setup>
import { RouterView } from 'vue-router'
import { initTheme, destroyTheme } from './utils/useTheme'
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  initTheme()
})

onBeforeUnmount(() => {
  destroyTheme()
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
