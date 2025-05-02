<template>
  <div class="page-container-scrollable">
    <div class="monitoring-content-header">
      <Button
        v-if="isTablet"
        icon="pi pi-bars"
        variant="text"
        severity="secondary"
        @click="openDrawer()"
      />
      <div v-if="deviceId" class="monitoring-content-header-title">
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
import { ref, watch, inject } from 'vue'
import { fetchPost } from '@/utils/fetcherAPI'
import { config } from '@/utils/config'
import SensorCard from '@/components/features/SensorCard.vue'
import Button from 'primevue/button'
import { isTablet } from '@/assets/styles/tokens/breakpoints'

const deviceId = inject('SelectedDeviceID')
const deviceName = inject('SelectedDeviceName')

const emit = defineEmits(['open-drawer'])

const devicesData = ref([])
const status = ref('loading')
const abortController = ref(null)

function openDrawer() {
  console.log('openDrawer')
  emit('open-drawer')
}

watch(
  () => deviceId.value,
  (newID) => {
    fetchPost(`${config.apiBaseUrl}/deviceSensors/${newID}`, devicesData, status, abortController)
  },
  { immediate: true },
)
</script>

<style scoped>
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

@media screen and (max-width: 576px) {
  .monitoring-content {
    padding: var(--size-content-padding);
    gap: 1.25rem;
  }
}
</style>
