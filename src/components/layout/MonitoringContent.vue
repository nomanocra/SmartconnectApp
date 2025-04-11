<template>
  <div class="monitoring-content">
    <div v-if="deviceId" class="monitoring-content-header">
      <h1>{{ deviceName }}</h1>
      <div class="device-id">
        <PhHardDrive :size="16" />
        <span>SmartBoitier {{ deviceId }}</span>
      </div>
    </div>
    <div v-else class="monitoring-content-header">
      <SkeletonRectangle class="h1-skeleton" />
      <SkeletonRectangle class="device-id-skeleton" />
    </div>
    <div v-if="status === 'loading'" class="monitoring-content-body">
      <SkeletonRectangle class="skeleton-sensor-card" v-for="i in 12" :key="i" />
    </div>
    <div v-if="status === 'loaded'" class="monitoring-content-body">
      <div v-for="sensors in devicesData.sensors" :key="sensors.id">
        <SensorCard :sensor="sensors" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { PhHardDrive } from '@phosphor-icons/vue'
import SkeletonRectangle from '@/components/base/SkeletonRectangle.vue'
import { ref, watch } from 'vue'
import { fetchPost } from '@/utils/fetcherAPI'
import { config } from '@/utils/config'
import SensorCard from '@/components/features/Sensorcard.vue'
const props = defineProps({
  deviceId: {
    type: [String, Number, null],
    required: false,
    default: null,
  },
  deviceName: {
    type: [String, Number, null],
    required: false,
    default: null,
  },
})

const devicesData = ref([])
const status = ref('loading')
const abortController = ref(null)

watch(devicesData, (newData) => {
  console.log('New devicesData :', newData)
})

watch(
  () => props.deviceId,
  (newID) => {
    fetchPost(`${config.apiBaseUrl}/deviceSensors/${newID}`, devicesData, status, abortController)
  },
)
</script>

<style scoped>
.monitoring-content {
  align-self: stretch;
  flex: 1;
  padding: var(--size-content-padding-xl);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
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
  height: 120px;
}
</style>
