<!--
  MonitoringNavigationPanel.vue

  This component provides the main navigation interface for the monitoring dashboard.
  It displays a hierarchical tree structure of devices and groups and main actions to
  add new devices and set the tree structure.
-->

<template>
  <div class="monitoring-navigation panel-container">
    <div class="monitoring-navigation-header">
      <h4>{{ $t('sidebar.monitoring') }}</h4>
      <div class="action-buttons">
        <Button
          icon="pi pi-plus"
          text
          size="small"
          v-tooltip.bottom="$t('pages.dashboard.addDevice')"
          @click="handleAddDevice"
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
        <Button
          icon="pi pi-sitemap"
          text
          size="small"
          v-tooltip.bottom="$t('pages.dashboard.manageTree')"
        />
      </div>
    </div>
    <div class="tree-menu">
      <TreeMenu
        :selected-id="selectedSerial"
        :tree-data="treeData"
        :status="treeDataStatus"
        @leaf-selected="handleLeafSelected"
      />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import TreeMenu from '@/components/features/TreeMenu.vue'
import AddDeviceForm from '@/components/features/AddDeviceFrom.vue'
import { inject, ref } from 'vue'

const selectedSerial = inject('selectedDeviceSerial')
const selectedName = inject('selectedDeviceName')
const treeData = inject('navigationTreeData')
const treeDataStatus = inject('navigationTreeStatus')

const addDeviceDialogVisible = ref(false)

const handleLeafSelected = (leafId, leafName) => {
  selectedSerial.value = leafId
  selectedName.value = leafName
}

const handleAddDevice = () => {
  addDeviceDialogVisible.value = true
}

const handleDeviceAdded = (deviceId, deviceName) => {
  addDeviceDialogVisible.value = false
  treeDataStatus.value = 'reloading'
  selectedSerial.value = deviceId
  selectedName.value = deviceName
}
</script>

<style scoped>
.monitoring-navigation {
  width: 280px;
  color: var(--p-text-secondary-color);
}

.monitoring-navigation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 0.125rem;
}

.tree-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

@media (max-width: 904px) {
  .monitoring-navigation {
    padding: 0rem;
  }
}
</style>
