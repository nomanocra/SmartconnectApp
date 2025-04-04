<template>
  <div class="monitoring-content">
    <div class="monitoring-content-header">
      <h1>Building 02</h1>
      <div class="device-id">
        <PhHardDrive :size="16" />
        <span>Gateway ZJFE3443IJ4</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PhHardDrive } from '@phosphor-icons/vue'
</script>

<style scoped>
.monitoring-content {
  align-self: stretch;
  flex: 1;
  padding: var(--size-content-padding-xl);
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
</style>
