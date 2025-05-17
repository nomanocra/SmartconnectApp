<template>
  <div class="monitoring-navigation panel-container">
    <div class="monitoring-navigation-header">
      <h4>Monitoring</h4>
      <div class="action-buttons">
        <Button
          icon="pi pi-plus"
          text
          size="small"
          v-tooltip.bottom="$t('pages.dashboard.addDevice')"
        />
        <Button
          icon="pi pi-folder-plus"
          text
          size="small"
          v-tooltip.bottom="$t('pages.dashboard.addGroup')"
        />
      </div>
    </div>
    <div class="tree-menu">
      <TreeMenu
        :selected-id="selectedId"
        :tree-data="treeData"
        :status="status"
        @leaf-selected="handleLeafSelected"
      />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import TreeMenu from '@/components/features/TreeMenu.vue'
import { inject, computed } from 'vue'

const selectedId = inject('SelectedDeviceID')
const selectedName = inject('SelectedDeviceName')
const treeData = inject('navigationTreeData')

const status = computed(() => {
  return treeData.value ? 'loaded' : 'loading'
})
const handleLeafSelected = (leafId, leafName) => {
  selectedId.value = leafId
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

@media (max-width: 904px) {
  .monitoring-navigation {
    padding: 0rem;
  }
}
</style>
