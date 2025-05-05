<template>
  <Toast :position="position" :group="group" class="custom-toast">
    <template #container="{ message, closeCallback }">
      <div class="main">
        <i :class="message.icon || 'pi pi-check'"></i>
        <div class="content">
          <span class="title">{{ message.summary }}</span>
          <div class="detail">{{ message.detail }}</div>
        </div>
        <div class="actions" v-if="message.actions">
          <template v-for="action in message.actions" :key="action.label">
            <Button
              size="small"
              :label="action.label"
              :variant="action.variant"
              @click="action.onClick"
            ></Button>
          </template>
        </div>
        <div v-if="message.closable" class="close-button-wrapper">
          <Button
            :severity="message.severity === 'error' ? 'danger' : message.severity"
            class="close-button"
            size="small"
            icon="pi pi-times"
            variant="text"
            @click="closeCallback"
          ></Button>
        </div>
      </div>
    </template>
  </Toast>
</template>

<script setup>
import Toast from 'primevue/toast'
import Button from 'primevue/button'

defineProps({
  position: {
    type: String,
    default: 'top-right',
  },
  group: {
    type: String,
    default: 'br',
  },
})
</script>

<style scoped>
.custom-toast {
  width: 200px;
}

.main {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.title {
  font-weight: 600;
  color: var(--p-text-primary-color);
  font-size: 0.875rem;
}

.detail {
  color: var(--p-text-secondary-color);
  white-space: pre-line;
  font-size: 0.75rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  justify-content: flex-end;
}

.close-button-wrapper {
  display: flex;
  align-items: top;
  align-self: flex-start;
  .close-button {
    width: 1.5rem;
    height: 1.5rem;
  }
}

/* Need to override here the close button size because the size overide in SmartTheme.js is not working */
</style>
