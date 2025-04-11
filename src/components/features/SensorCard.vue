<template>
  <div class="sensor-card">
    <div class="sensor-card-header">
      <div class="header-left">
        <SensorIcon :icon="sensor.type" :size="20" class="sensor-icon" />
        <div class="header-texts">
          <span class="title">{{ sensor.name }}</span>
          <span class="last-update">{{
            new Date(sensor.lastUpdate).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          }}</span>
        </div>
      </div>
      <div class="header-right">
        <span class="value">{{ sensor.value }}</span>
        <span class="unit">{{ sensor.unit }}</span>
      </div>
    </div>
    <div class="sensor-card-body"></div>
  </div>
</template>

<script setup>
import SensorIcon from '@/components/base/SensorIcon.vue'
defineProps({
  sensor: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.sensor-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background-color: var(--p-background-lvl1);
  border: 1px solid var(--p-border-lvl2);
  padding: 1rem;
  height: 7.5rem;
  cursor: pointer;
  &:hover {
    border: 1px solid var(--p-background-lvl4);
  }
}

.sensor-card-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.header-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;

  .sensor-icon {
    color: var(--p-text-secondary-color);
  }
}

.header-texts {
  display: flex;
  flex-direction: column;
  .title {
    font-size: 0.8125rem;
    font-weight: 600;
  }
  .last-update {
    color: var(--p-text-tertiary-color);
    font-size: 0.6875rem;
  }
}

.header-right {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  color: var(--p-primary-color);
  gap: 0.25rem;
  .value {
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1;
  }
  .unit {
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.2;
  }
}
.sensor-card-body {
  /* background-color: var(--p-background-lvl3); */
  flex: 1;
}
</style>
