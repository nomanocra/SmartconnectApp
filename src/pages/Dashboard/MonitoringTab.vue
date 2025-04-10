<template>
  <MonitoringNavigationPanel @device-selected="handleDeviceSelected" />
  <MonitoringContent :device-id="deviceID" :device-name="deviceName" />
</template>

<script setup>
import MonitoringNavigationPanel from '@/components/layout/MonitoringNavigationPanel.vue'
import MonitoringContent from '@/components/layout/MonitoringContent.vue'
import { ref } from 'vue'

const deviceID = ref(null)
const deviceName = ref(null)

const handleDeviceSelected = (id, name) => {
  deviceID.value = id
  deviceName.value = name
}
</script>

<style scoped></style>
