<script setup>
import { RouterView } from 'vue-router'
import { initTheme, destroyTheme } from './utils/useTheme'
import { onMounted, onBeforeUnmount } from 'vue'
import { initPageNameManagement, destroyPageNameManagement } from './utils/managePageName'

onMounted(() => {
  initTheme()
  initPageNameManagement()
})

onBeforeUnmount(() => {
  destroyTheme()
  destroyPageNameManagement()
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
