<template>
  <div class="dashboard-page">
    <MainSidebar />
    <RouterView />
  </div>
</template>

<script setup>
import MainSidebar from '@/components/layout/MainSidebar.vue'
import { ref, onMounted, provide, watch, computed } from 'vue'
import { useAuth } from '@/utils/authService'
import { useToast } from 'primevue/usetoast'
import fetchData from '@/utils/fetcherAPI'
import { config } from '@/utils/config'
import { findFirstLeafId } from '@/utils/treeMenuUtils'

const userInfos = ref(null)
provide('userInfos', userInfos)

const toast = useToast()

/* Gestion de la récupération des données pour le Dashbaord Monitoring*/
const MONITORING_STORAGE_KEY = 'monitoring-tree-data'
const CACHE_DURATION = 30 * 60 * 1000 // 120 minutes in milliseconds

const selectedDeviceSerial = ref(null)
const selectedDeviceName = ref(null)
const deviceMappingResponse = ref([])
const navigationTreestatus = ref('loading')

// Navigation panel size management
const DEFAULT_NAVIGATION_SIZE = 300
const navigationSize = ref(DEFAULT_NAVIGATION_SIZE)

const navigationTreeData = computed(() => {
  return deviceMappingResponse.value.data || []
})

provide('selectedDeviceSerial', selectedDeviceSerial)
provide('selectedDeviceName', selectedDeviceName)
provide('navigationTreeData', navigationTreeData)
provide('navigationTreeStatus', navigationTreestatus)
provide('navigationSize', navigationSize)

const abortController = ref(null)

onMounted(async () => {
  const { getUserInfo } = useAuth()
  const userInfo = await getUserInfo()
  userInfos.value = userInfo.user
  refreshDeviceMapping()
})

watch(
  navigationTreestatus,
  (newStatus) => {
    if (
      newStatus === 'loaded' &&
      navigationTreeData.value &&
      selectedDeviceSerial.value === null &&
      selectedDeviceName.value === null
    ) {
      const { id, name } = findFirstLeafId(navigationTreeData.value)
      if (id && name) {
        selectedDeviceSerial.value = id
        selectedDeviceName.value = name
      }
    } else if (newStatus === 'error') {
      // Reset device selection
      selectedDeviceSerial.value = null
      selectedDeviceName.value = null

      // Display error toast
      const errorTitle = deviceMappingResponse.value.title || 'Error'
      const errorDetail =
        deviceMappingResponse.value.detail || 'An error occurred while loading devices'
      const errorStatus = deviceMappingResponse.value.status || 'Unknown'

      toast.add({
        severity: 'error',
        summary: errorTitle,
        detail: `${errorDetail} (Status: ${errorStatus})`,
        group: 'br',
        closable: true,
        icon: 'pi pi-exclamation-circle',
      })
    } else if (newStatus === 'reloading') {
      refreshDeviceMapping()
    }
  },
  { immediate: true },
)

function refreshDeviceMapping() {
  fetchData(`${config.apiBaseUrl}/users/device-mapping`, {
    fetchedResponse: deviceMappingResponse,
    status: navigationTreestatus,
    abortController,
    cacheKey: MONITORING_STORAGE_KEY,
    cacheDuration: CACHE_DURATION,
    method: 'GET',
    requiresAuth: true,
  })
}
</script>

<style scoped>
.dashboard-page {
  background-color: var(--p-background-lvl0);
  display: flex;
  flex-direction: row;
  height: 100vh;
  height: 100dvh; /* Us Fallback for browsers that don't support dvh */
}

/* Smartphones(portrait) */
@media screen and (max-width: 576px) {
  .dashboard-page {
    flex-direction: column-reverse;
  }
}
</style>
