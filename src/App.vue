<script setup>
import { RouterView } from 'vue-router'
import { initTheme, destroyTheme } from './utils/useTheme'
import { onMounted, onBeforeUnmount } from 'vue'
import { initPageNameManagement, destroyPageNameManagement } from './utils/managePageName'
import CustomToast from '@/components/base/CustomToast.vue'

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
  <CustomToast position="top-right" group="tr"> </CustomToast>
  <CustomToast position="bottom-right" group="br"> </CustomToast>
</template>

<style scoped></style>
