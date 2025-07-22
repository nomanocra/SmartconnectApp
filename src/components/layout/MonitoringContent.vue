<template>
  <div
    v-if="navigationDataStatus == 'loaded' && navigationTreeData.length === 0"
    class="empty-state-content"
  >
    <EmptyStateIcon class="empty-state-icon" />
    <h3>{{ $t('pages.dashboard.noDevice') }}</h3>
    <p>{{ $t('pages.dashboard.noDeviceDescription') }}</p>
    <Button :label="$t('pages.dashboard.addDevice')" icon="pi pi-plus" @click="handleAddDevice()" />
  </div>
  <div class="monitoring-content" v-else>
    <div class="monitoring-content-header">
      <Button v-if="isTablet" icon="pi pi-plus" @click="handleOpenDrawer()" />
      <div v-if="deviceSerial && deviceName" class="monitoring-content-header-title">
        <h1>{{ deviceName }}</h1>
        <div class="device-id">
          <PhHardDrive :size="16" />
          <span>{{ deviceSerial }}</span>
        </div>
      </div>
      <div v-else class="monitoring-content-header-title">
        <SkeletonRectangle class="h1-skeleton" />
        <SkeletonRectangle class="device-id-skeleton" />
      </div>
    </div>

    <div v-if="deviceSerial && deviceName" class="monitoring-content-body">
      <div v-for="sensor in currentDevicesData.sensors" :key="sensor.id">
        <SensorCard
          :sensor="sensor"
          :status="chartStatus"
          :data-history="
            currentDeviceHistories.find((s) => s?.sensor_id === sensor.id)?.history || []
          "
        />
      </div>
    </div>
    <div v-else-if="!dataLoaded" class="monitoring-content-body">
      <SkeletonRectangle class="skeleton-sensor-card" v-for="i in 12" :key="i" />
    </div>
  </div>
</template>

<script setup>
import { PhHardDrive } from '@phosphor-icons/vue'
import SkeletonRectangle from '@/components/base/SkeletonRectangle.vue'
import EmptyStateIcon from '@/components/base/EmptyStateIcon.vue'
import { inject, ref, watch, computed, onMounted } from 'vue'
import SensorCard from '@/components/features/SensorCard.vue'
import Button from 'primevue/button'
import { isTablet } from '@/assets/styles/tokens/breakpoints'
import fetchData from '@/utils/fetcherAPI'
import { config } from '@/utils/config'
import { findDeviceInTree } from '@/utils/treeMenuUtils'

const deviceSerial = inject('selectedDeviceSerial')
const deviceName = inject('selectedDeviceName')
const navigationTreeData = inject('navigationTreeData')
const navigationDataStatus = inject('navigationTreeStatus')

const chartStatus = ref('loading')
const dataLoaded = computed(() => {
  return chartStatus.value === 'loaded'
})
const deviceHistoryResponse = ref([])
const currentDeviceHistories = computed(() => {
  return deviceHistoryResponse.value.data || []
})
const now = new Date()
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
const historyStartDate = ref(oneHourAgo.toISOString())
const historyEndDate = ref(now.toISOString())
const abortController = ref(null)

const emit = defineEmits(['openDrawer', 'openAddDeviceDialog'])

const currentDevicesData = ref([])

watch([deviceSerial, navigationTreeData], () => {
  refreshDeviceContent()
})

onMounted(() => {
  refreshDeviceContent()
})

function refreshDeviceContent() {
  currentDevicesData.value = findDeviceInTree(navigationTreeData.value, deviceSerial.value) || {}
  if (!currentDevicesData.value?.sensors?.length) return

  const options = {
    fetchedResponse: deviceHistoryResponse,
    status: chartStatus,
    method: 'GET',
    requiresAuth: true,
    abortController,
  }
  fetchData(
    `${config.apiBaseUrl}/sensor-history?sensor_ids[]=${currentDevicesData.value.sensors.map((sensor) => sensor.id).join('&sensor_ids[]=')}&start_date=${historyStartDate.value}&end_date=${historyEndDate.value}`,
    options,
  )
}

function handleOpenDrawer() {
  emit('open-drawer')
}

function handleAddDevice() {
  emit('openAddDeviceDialog')
}
</script>

<style scoped>
.monitoring-content {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--size-content-padding-lg);
  gap: var(--size-content-gap-lg);

  overflow-y: auto;
}

@media screen and (max-width: 576px) {
  .monitoring-content {
    padding: var(--size-content-padding-sm);
    padding-top: var(--size-content-padding-md);
    padding-bottom: var(--size-content-padding-md);
    gap: var(--size-content-gap);
  }
}

.device-id {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--p-text-tertiary-color);
  gap: 0.5rem;
}

.monitoring-content-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.monitoring-content-header-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.monitoring-content-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.5rem;
}

.h1-skeleton {
  width: 200px;
  height: 2.31rem;
}

.device-id-skeleton {
  width: 220px;
  height: 1.125rem;
}

.skeleton-sensor-card {
  height: var(--size-sensor-card-height);
}
.empty-state-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: var(--p-background-lvl1);
  margin: 1rem;
  border-radius: var(--p-border-radius-xs);
  text-align: center;
  h1 {
    color: var(--p-text-secondary-color);
  }
  p {
    max-width: 32rem;
    font-size: 0.875rem;
    line-height: 1.4;
    color: var(--p-text-tertiary-color);
  }
}

.empty-state-icon {
  width: 14rem;
}
</style>
