<template>
  <div class="monitoring-navigation">
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
      <TreeMenu :data="treeData" :status="status" @leaf-selected="handleLeafSelected" />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import TreeMenu from '@/components/features/TreeMenu.vue'
import { ref, onMounted } from 'vue'
import { fetchPostWithCache } from '@/utils/fetcherAPI'
import { config } from '@/utils/config'

const treeData = ref([])
const status = ref('loading')
const abortController = ref(null)

const STORAGE_KEY = 'monitoring-tree-data'
const CACHE_DURATION = 120 * 60 * 1000 // 120 minutes in milliseconds

const emit = defineEmits(['device-selected'])

onMounted(() => {
  fetchPostWithCache(
    `${config.apiBaseUrl}/monitoringList`,
    treeData,
    status,
    abortController,
    STORAGE_KEY,
    CACHE_DURATION,
  )
})

const handleLeafSelected = (deviceID, deviceName) => {
  emit('device-selected', deviceID, deviceName)
}
</script>

<style scoped>
.monitoring-navigation {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 280px;
  padding: var(--size-content-padding);
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
