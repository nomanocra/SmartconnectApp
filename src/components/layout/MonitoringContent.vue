<template>
  <div class="monitoring-content">
    <div class="monitoring-content-header">
      <Button
        v-if="isTablet"
        icon="pi pi-bars"
        variant="text"
        severity="secondary"
        @click="openDrawer()"
      />
      <div v-if="deviceId && deviceName" class="monitoring-content-header-title">
        <h1>{{ deviceName }}</h1>
        <div class="device-id">
          <PhHardDrive :size="16" />
          <span>SmartBoitier {{ deviceId }}</span>
        </div>
      </div>
      <div v-else class="monitoring-content-header-title">
        <SkeletonRectangle class="h1-skeleton" />
        <SkeletonRectangle class="device-id-skeleton" />
      </div>
    </div>

    <div v-if="deviceId && deviceName" class="monitoring-content-body">
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
    <div v-else class="monitoring-content-body">
      <SkeletonRectangle class="skeleton-sensor-card" v-for="i in 12" :key="i" />
    </div>
  </div>
</template>

<script setup>
import { PhHardDrive } from '@phosphor-icons/vue'
import SkeletonRectangle from '@/components/base/SkeletonRectangle.vue'
import { inject, ref, watch } from 'vue'
import SensorCard from '@/components/features/SensorCard.vue'
import Button from 'primevue/button'
import { isTablet } from '@/assets/styles/tokens/breakpoints'
import fetchData from '@/utils/fetcherAPI'
import { config } from '@/utils/config'

const deviceId = inject('SelectedDeviceID')
const deviceName = inject('SelectedDeviceName')
const navigationTreeData = inject('navigationTreeData')

const chartStatus = ref('loading')
const currentDeviceHistories = ref([])
const historyStartDate = ref('2025-01-01T12:00:00')
const historyEndDate = ref('2025-01-01T18:00:00')
const abortController = ref(null)

const emit = defineEmits(['open-drawer'])

const currentDevicesData = ref([])

watch(deviceId, () => {
  currentDevicesData.value = findCurrentDeviceInTreeData() || {}
  console.log('currentDevicesData', currentDevicesData.value)
  if (!currentDevicesData.value?.sensors?.length) return

  const options = {
    data: currentDeviceHistories,
    status: chartStatus,
    method: 'GET',
    requiresAuth: true,
    abortController,
  }
  fetchData(
    `${config.apiBaseUrl}/sensor-history?sensor_ids[]=${currentDevicesData.value.sensors.map((sensor) => sensor.id).join('&sensor_ids[]=')}&start_date=${historyStartDate.value}&end_date=${historyEndDate.value}`,
    options,
  )
})

function openDrawer() {
  emit('open-drawer')
}

// Fonction pour extraire tous les leaf nodes du tree data
function findCurrentDeviceInTreeData(nodes = navigationTreeData.value) {
  console.log('nodes', nodes)
  if (!nodes || !Array.isArray(nodes)) return null
  let index = 0
  for (const node of nodes) {
    index++
    console.log('node', node, index)
    if (!node.children && node.deviceSerial === deviceId.value) {
      console.log('return node', node, index)
      return node
    } else if (node.children) {
      console.log(' iterate node.children', node.children, index)
      const result = findCurrentDeviceInTreeData(node.children)
      if (result) return result
    }
  }
  return null
}
</script>

<style scoped>
.monitoring-content {
  display: flex;
  flex-direction: column;
  padding: var(--size-content-padding-lg);
  gap: var(--size-content-gap-lg);
  height: 100%;
  overflow-y: auto;
}

@media screen and (max-width: 576px) {
  .monitoring-content {
    padding: var(--size-content-padding-sm);
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
</style>
