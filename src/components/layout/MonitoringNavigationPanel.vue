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

        <Button
          icon="pi pi-sitemap"
          text
          size="small"
          v-tooltip.bottom="$t('pages.dashboard.manageTree')"
        />
      </div>
    </div>
    <div class="empty-state-content" v-if="treeDataStatus == 'loaded' && treeData.length === 0">
      <EmptyStateIcon class="empty-state-icon" style="width: 8rem" />
      <span>{{ $t('pages.dashboard.noDevice') }}</span>
    </div>
    <div v-else class="tree-menu">
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
import EmptyStateIcon from '@/components/base/EmptyStateIcon.vue'
import TreeMenu from '@/components/features/TreeMenu.vue'
import { inject } from 'vue'

const emit = defineEmits(['openAddDeviceDialog'])

const selectedSerial = inject('selectedDeviceSerial')
const selectedName = inject('selectedDeviceName')
const treeData = inject('navigationTreeData')
const treeDataStatus = inject('navigationTreeStatus')

const handleAddDevice = () => {
  emit('openAddDeviceDialog')
}
const handleLeafSelected = (leafId, leafName) => {
  selectedSerial.value = leafId
  selectedName.value = leafName
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

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  span {
    margin-top: -0.5rem;
    font-size: 0.875rem;
    color: var(--p-text-tertiary-color);
  }
}

@media (max-width: 904px) {
  .monitoring-navigation {
    padding: 0rem;
  }
}
</style>
