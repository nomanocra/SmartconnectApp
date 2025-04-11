<template>
  <MonitoringNavigationPanel
    v-if="!isTablet"
    @device-selected="handleDeviceSelected"
    class="navigation"
  />
  <Drawer v-model:visible="drawerOpen" :modal="true">
    <MonitoringNavigationPanel @device-selected="handleDeviceSelected" />
  </Drawer>
  <MonitoringContent :device-id="deviceID" :device-name="deviceName" @open-drawer="openDrawer()" />
</template>

<script setup>
import MonitoringNavigationPanel from '@/components/layout/MonitoringNavigationPanel.vue'
import MonitoringContent from '@/components/layout/MonitoringContent.vue'
import Drawer from 'primevue/drawer'

import { ref } from 'vue'
import { isTablet } from '@/assets/styles/tokens/breakpoints'
const deviceID = ref(null)
const deviceName = ref(null)
const drawerOpen = ref(false)

const handleDeviceSelected = (id, name) => {
  deviceID.value = id
  deviceName.value = name
}

function openDrawer() {
  drawerOpen.value = true
  console.log('openDrawer here')
}
</script>

<style scoped>
.p-drawer-header {
  justify-content: flex-end;
}
</style>
