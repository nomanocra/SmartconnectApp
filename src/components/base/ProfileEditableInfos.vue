<template>
  <div class="editable_info">
    <label for="label">{{ props.label }}</label>
    <span class="non-editable-value" v-if="!props.editable" id="value">{{ props.value }}</span>
    <div v-else class="editable-value" @click="handleEdit">
      <span id="value">{{ props.value }}</span>
      <i class="pi pi-pencil" style="font-size: 0.75rem"></i>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['handleEdit'])
const handleEdit = () => {
  emit('handleEdit')
}
</script>

<style scoped>
.editable_info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  max-width: fit-content;
}

label {
  font-size: 1rem;
  font-weight: 500;
  color: var(--p-text-primary-color);
}

span {
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--p-text-secondary-color);
}

.non-editable-value {
  padding: var(--size-content-padding-xs);
  cursor: default;
}

.editable-value {
  display: flex;
  align-items: center;
  gap: var(--size-content-gap-xs);
  cursor: pointer;
  padding: var(--size-content-padding-xs);
  border-radius: var(--p-button-border-radius);
  .pi-pencil {
    color: var(--p-text-secondary-color);
    opacity: 0.3;
  }

  &:hover {
    background-color: var(--p-button-text-primary-hover-background);
    .pi-pencil {
      opacity: 1;
    }
  }
  &:active {
    background-color: var(--p-button-text-primary-active-background);
  }
}
</style>
