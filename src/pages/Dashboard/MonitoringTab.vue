<template>
  <MonitoringNavigationPanel v-if="!isTablet" class="navigation" />
  <Drawer v-model:visible="drawerOpen" :modal="true">
    <MonitoringNavigationPanel />
  </Drawer>
  <MonitoringContent @open-drawer="openDrawer()" />
</template>

<script setup>
import MonitoringNavigationPanel from '@/components/layout/MonitoringNavigationPanel.vue'
import MonitoringContent from '@/components/layout/MonitoringContent.vue'
import Drawer from 'primevue/drawer'

import { ref, watch, inject } from 'vue'
import { isTablet } from '@/assets/styles/tokens/breakpoints'

//Used for mobile layout
const drawerOpen = ref(false)

const SelectedDeviceID = inject('SelectedDeviceID')

// Close the drawer when the selected device is changed (for mobile layout)
watch(
  () => SelectedDeviceID.value,
  () => {
    drawerOpen.value = false
  },
)

function openDrawer() {
  drawerOpen.value = true
}
</script>

<style scoped>
.p-drawer-header {
  justify-content: flex-end;
}
</style>
