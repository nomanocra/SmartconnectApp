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
import fetchData from '@/utils/fetcherAPI'
import { config } from '@/utils/config'

const MONITORING_STORAGE_KEY = 'monitoring-tree-data'
const CACHE_DURATION = 30 * 60 * 1000 // 120 minutes in milliseconds

const SelectedDeviceID = ref(null)
const SelectedDeviceName = ref(null)
const navigationTreeData = ref([])

const navigationTreestatus = ref('loading')
const abortController = ref(null)

//Used for mobile layout
const drawerOpen = ref(false)

provide('SelectedDeviceID', SelectedDeviceID)
provide('SelectedDeviceName', SelectedDeviceName)
provide('navigationTreeData', navigationTreeData)

onMounted(() => {
  fetchData(`${config.apiBaseUrl}/users/device-mapping`, {
    data: navigationTreeData,
    status: navigationTreestatus,
    abortController,
    cacheKey: MONITORING_STORAGE_KEY,
    cacheDuration: CACHE_DURATION,
    method: 'GET',
    requiresAuth: true,
  })
})

watch(
  navigationTreestatus,
  (newStatus) => {
    if (newStatus === 'loaded' && navigationTreeData.value) {
      console.log('navigationTreeData', navigationTreeData.value)
      const { id, name } = findFirstLeafId(navigationTreeData.value)
      if (id && name) {
        SelectedDeviceID.value = id
        SelectedDeviceName.value = name
      }
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

// Function to find the first leaf after loading of the page
function findFirstLeafId(nodes) {
  if (!nodes || !Array.isArray(nodes)) {
    return { id: null, name: null }
  }

  for (const node of nodes) {
    if (!node.children) {
      return { id: node.deviceSerial, name: node.name }
    }
    if (node.children) {
      const result = findFirstLeafId(node.children)
      if (result.id && result.name) {
        return result
      }
    }
  }
  return { id: null, name: null }
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
