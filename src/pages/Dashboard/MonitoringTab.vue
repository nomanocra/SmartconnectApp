<template>
  <MonitoringNavigationPanel
    v-if="!isTablet"
    class="navigation"
    @openAddDeviceDialog="handleOpenAddDeviceDialog()"
  />
  <Drawer v-else v-model:visible="drawerOpen" :modal="true">
    <MonitoringNavigationPanel @openAddDeviceDialog="handleOpenAddDeviceDialog()" />
  </Drawer>
  <MonitoringContent
    @openDrawer="openDrawer()"
    @openAddDeviceDialog="handleOpenAddDeviceDialog()"
  />
  <Dialog
    v-model:visible="addDeviceDialogVisible"
    modal
    :header="$t('pages.dashboard.addDevice')"
    :style="{ width: '40rem' }"
    :draggable="false"
  >
    <AddDeviceForm @device-added="handleDeviceAdded" />
  </Dialog>
</template>

<script setup>
import MonitoringNavigationPanel from '@/components/layout/MonitoringNavigationPanel.vue'
import MonitoringContent from '@/components/layout/MonitoringContent.vue'
import Drawer from 'primevue/drawer'
import Dialog from 'primevue/dialog'
import AddDeviceForm from '@/components/features/AddDeviceFrom.vue'

import { ref, watch, inject } from 'vue'
import { isTablet } from '@/assets/styles/tokens/breakpoints'

//Used for mobile layout
const drawerOpen = ref(false)

const selectedDeviceSerial = inject('selectedDeviceSerial')
const addDeviceDialogVisible = ref(false)
const treeDataStatus = inject('navigationTreeStatus')
const selectedSerial = inject('selectedDeviceSerial')
const selectedName = inject('selectedDeviceName')

const handleOpenAddDeviceDialog = () => {
  addDeviceDialogVisible.value = true
}

const handleDeviceAdded = (deviceId, deviceName) => {
  addDeviceDialogVisible.value = false
  treeDataStatus.value = 'reloading'
  selectedSerial.value = deviceId
  selectedName.value = deviceName
}

// Close the drawer when the selected device is changed (for mobile layout)
watch(
  () => selectedDeviceSerial.value,
  () => {
    drawerOpen.value = false
  },
)

function openDrawer() {
  drawerOpen.value = true
}
</script>

const handleAddDevice = () => { addDeviceDialogVisible.value = true }

<style scoped>
.p-drawer-header {
  justify-content: flex-end;
}
</style>
