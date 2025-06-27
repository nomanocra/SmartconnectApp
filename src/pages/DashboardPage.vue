<template>
  <div class="dashboard-page">
    <MainSidebar />
    <RouterView />
  </div>
</template>

<script setup>
import MainSidebar from '@/components/layout/MainSidebar.vue'
import { ref, onMounted, provide, watch } from 'vue'
import { useAuth } from '@/utils/authService'
import fetchData from '@/utils/fetcherAPI'
import { config } from '@/utils/config'
import { findFirstLeafId } from '@/utils/treeMenuUtils'

const userInfos = ref(null)
provide('userInfos', userInfos)

/* Gestion de la récupération des données pour le Dashbaord Monitoring*/
const MONITORING_STORAGE_KEY = 'monitoring-tree-data'
const CACHE_DURATION = 30 * 60 * 1000 // 120 minutes in milliseconds

const SelectedDeviceID = ref(null)
const SelectedDeviceName = ref(null)
const navigationTreeData = ref([])
const navigationTreestatus = ref('loading')

provide('SelectedDeviceID', SelectedDeviceID)
provide('SelectedDeviceName', SelectedDeviceName)
provide('navigationTreeData', navigationTreeData)
const abortController = ref(null)

onMounted(async () => {
  const { getUserInfo } = useAuth()
  const userInfo = await getUserInfo()
  userInfos.value = userInfo.user

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
      const { id, name } = findFirstLeafId(navigationTreeData.value)
      if (id && name) {
        SelectedDeviceID.value = id
        SelectedDeviceName.value = name
      }
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
