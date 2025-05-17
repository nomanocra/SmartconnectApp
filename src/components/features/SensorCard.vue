<template>
  <div class="sensor-card">
    <div class="sensor-card-header">
      <div class="header-left">
        <SensorIcon :icon="sensor.type" :size="20" class="sensor-icon" />
        <div class="header-texts">
          <span class="title">{{
            locale === 'en' ? sensor.name || sensor.nom : sensor.nom || sensor.name
          }}</span>
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
    <SkeletonRectangle v-if="status === 'loading'" class="sparkline" />

    <SparklineChart
      v-else-if="status === 'loaded' && sortedData.values.length"
      :data="sortedData"
      class="sparkline"
    />
    <div v-else class="sparkline-error">
      <p class="error-message">{{ $t('errors.noData') }}</p>
    </div>
  </div>
</template>

<script setup>
import SensorIcon from '@/components/base/SensorIcon.vue'
import { useI18n } from 'vue-i18n'
import SparklineChart from '@/components/base/SparklineChart.vue'
import { computed } from 'vue'

import SkeletonRectangle from '@/components/base/SkeletonRectangle.vue'
const props = defineProps({
  sensor: {
    type: Object,
    required: true,
  },
  dataHistory: {
    type: Array,
    default: () => [],
  },
  status: {
    type: String,
    default: 'loading',
  },
})

const sortedData = computed(() => {
  // Create a copy of the array before sorting to avoid side effects
  const sortedHistory = [...props.dataHistory].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  )
  if (sortedHistory.length > 0) {
    return {
      labels: sortedHistory.map((item) =>
        new Date(item.timestamp).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      ),
      values: sortedHistory.map((item) => item.value),
      unit: props.sensor.unit,
    }
  }
  return {
    labels: [],
    values: [],
    unit: props.sensor.unit,
  }
})

// Get the current language
const { locale } = useI18n()
</script>

<style scoped>
.sensor-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background-color: var(--p-background-lvl1);
  border: 1px solid var(--p-border-lvl2);
  padding: 1rem;
  height: var(--size-sensor-card-height);
  border-radius: var(--p-form-field-border-radius);
  /* cursor: pointer; */
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
.sparkline {
  /* background-color: var(--p-background-lvl3); */
  flex: 1;
  align-self: stretch;
}

.sparkline-error {
  display: flex;
  flex: 1;
  padding: 0rem 0.75rem;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: var(--p-background-lvl2);
  border-radius: var(--p-form-field-border-radius);
  .error-message {
    color: var(--p-text-tertiary-color);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.2;
  }
}
</style>
