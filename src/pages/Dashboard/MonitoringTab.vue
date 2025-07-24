<template>
  <ResizableSection
    v-if="!isTablet"
    grab-position="right"
    :min-size="200"
    :max-size="500"
    :default-size="navigationSize || 300"
    @size-updated="handleNavigationSizeUpdated"
  >
    <MonitoringNavigationPanel
      class="navigation"
      @open-add-device-dialog="handleOpenAddDeviceDialog()"
    />
  </ResizableSection>

  <Drawer v-else v-model:visible="drawerOpen" :modal="true">
    <MonitoringNavigationPanel @open-add-device-dialog="handleOpenAddDeviceDialog()" />
  </Drawer>
  <MonitoringContent
    @open-drawer="openDrawer()"
    @open-add-device-dialog="handleOpenAddDeviceDialog()"
    @open-edit-device-dialog="handleOpenEditDeviceDialog()"
  />
  <Dialog
    v-model:visible="addDeviceDialogVisible"
    modal
    :header="$t('pages.dashboard.addDevice')"
    :style="{ width: '41rem' }"
    :draggable="false"
  >
    <AddDeviceForm @device-added="handleCloseAddDeviceDialog()" />
  </Dialog>
  <Dialog
    v-model:visible="editDeviceDialogVisible"
    modal
    :header="$t('pages.dashboard.editDeviceTitle')"
    :style="{ width: '40rem' }"
    :draggable="false"
  >
    <EditDeviceForm
      :deviceName="selectedDeviceName"
      :deviceAddress="selectedDeviceSerial"
      @device-edited="handleCloseEditDeviceDialog"
      @close-edit-device="() => handleCloseEditDeviceDialog()"
    />
  </Dialog>
</template>

<script setup>
import MonitoringNavigationPanel from '@/components/layout/MonitoringNavigationPanel.vue'
import MonitoringContent from '@/components/layout/MonitoringContent.vue'
import Drawer from 'primevue/drawer'
import Dialog from 'primevue/dialog'
import AddDeviceForm from '@/components/features/AddDeviceFrom.vue'
import EditDeviceForm from '@/components/features/EditDeviceFrom.vue'
import ResizableSection from '@/components/base/ResizableSection.vue'
import { ref, watch, inject } from 'vue'
import { isTablet } from '@/assets/styles/tokens/breakpoints'

//Used for mobile layout
const drawerOpen = ref(false)

const addDeviceDialogVisible = ref(false)
const editDeviceDialogVisible = ref(false)
const selectedDeviceSerial = inject('selectedDeviceSerial')
const selectedDeviceName = inject('selectedDeviceName')
const treeDataStatus = inject('navigationTreeStatus')
const navigationSize = inject('navigationSize')

const handleOpenAddDeviceDialog = () => {
  addDeviceDialogVisible.value = true
}

const handleCloseAddDeviceDialog = (deviceId, deviceName) => {
  addDeviceDialogVisible.value = false
  selectedDeviceSerial.value = deviceId
  selectedDeviceName.value = deviceName
}

const handleOpenEditDeviceDialog = () => {
  editDeviceDialogVisible.value = true
}

const handleCloseEditDeviceDialog = (deviceName) => {
  editDeviceDialogVisible.value = false
  selectedDeviceName.value = deviceName
  treeDataStatus.value = 'reloading'
}

watch(
  () => selectedDeviceSerial.value,
  () => {
    drawerOpen.value = false
  },
)

function openDrawer() {
  drawerOpen.value = true
}

function handleNavigationSizeUpdated(size) {
  navigationSize.value = size
}
</script>

<style scoped>
.p-drawer-header {
  justify-content: flex-end;
}

.navigation {
  width: 100%;
  height: 100%;
}
</style>
