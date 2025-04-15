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

import { ref, provide, onMounted, watch } from 'vue'
import { isTablet } from '@/assets/styles/tokens/breakpoints'
import { fetchPostWithCache } from '@/utils/fetcherAPI'
import { config } from '@/utils/config'

const STORAGE_KEY = 'monitoring-tree-data'
const CACHE_DURATION = 120 * 60 * 1000 // 120 minutes in milliseconds

const SelectedDeviceID = ref(null)
const SelectedDeviceName = ref(null)
const navigationTreeData = ref(null)

const navigationTreestatus = ref('loading')
const abortController = ref(null)
const drawerOpen = ref(false)

provide('SelectedDeviceID', SelectedDeviceID)
provide('SelectedDeviceName', SelectedDeviceName)
provide('navigationTreeData', navigationTreeData)

onMounted(() => {
  fetchPostWithCache(
    `${config.apiBaseUrl}/monitoringList`,
    navigationTreeData,
    navigationTreestatus,
    abortController,
    STORAGE_KEY,
    CACHE_DURATION,
  )
})

watch(
  navigationTreestatus,
  (newStatus) => {
    if (newStatus === 'loaded') {
      const { id, name } = findFirstLeafId(navigationTreeData.value)
      SelectedDeviceID.value = id
      SelectedDeviceName.value = name
    }
  },
  { immediate: true },
)

watch(
  () => SelectedDeviceID.value,
  () => {
    drawerOpen.value = false
  },
)

// Funciton to find the first leaf after loading of the page
function findFirstLeafId(nodes) {
  for (const node of nodes) {
    if (!node.children) {
      return { id: node.id, name: node.name }
    }
    if (node.children) {
      return findFirstLeafId(node.children)
    }
  }
  return null
}

function openDrawer() {
  drawerOpen.value = true
}
</script>

<style scoped>
.p-drawer-header {
  justify-content: flex-end;
}
</style>
