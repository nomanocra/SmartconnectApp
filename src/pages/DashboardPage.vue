<template>
  <div class="dashboard-page">
    <MainSidebar />
    <RouterView />
    <CustomToast position="bottom-right" group="br" />
  </div>
</template>

<script setup>
import MainSidebar from '@/components/layout/MainSidebar.vue'
import CustomToast from '@/components/base/CustomToast.vue'
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

const SelectedDeviceID = ref(null)
const SelectedDeviceName = ref(null)
const deviceMappingResponse = ref([])
const navigationTreestatus = ref('loading')

const navigationTreeData = computed(() => {
  return deviceMappingResponse.value.data || []
})

provide('SelectedDeviceID', SelectedDeviceID)
provide('SelectedDeviceName', SelectedDeviceName)
provide('navigationTreeData', navigationTreeData)
provide('navigationTreeStatus', navigationTreestatus)

const abortController = ref(null)

onMounted(async () => {
  const { getUserInfo } = useAuth()
  const userInfo = await getUserInfo()
  userInfos.value = userInfo.user

  fetchData(`${config.apiBaseUrl}/users/device-mapping`, {
    fetchedResponse: deviceMappingResponse,
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
      const { id, name } = findFirstLeafId(navigationTreeData.value)
      if (id && name) {
        SelectedDeviceID.value = id
        SelectedDeviceName.value = name
      }
    } else if (newStatus === 'error') {
      SelectedDeviceID.value = null
      SelectedDeviceName.value = null
    }
  },
  { immediate: true },
)

// Watch for errors and display them in toast
watch(
  [navigationTreestatus],
  ([newStatus]) => {
    if (newStatus === 'error') {
      // Extract error details from the error object
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
    }
  },
  { immediate: true },
)
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
