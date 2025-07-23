<template>
  <div class="tree-leaf" :class="{ selected: selected }" @click="handleClick(id, label)">
    <PhHardDrive class="tree-leaf-icon" :size="16" />
    <span class="tree-leaf-label" :title="label">{{ label }}</span>
  </div>
</template>

<script setup>
import { PhHardDrive } from '@phosphor-icons/vue'

defineProps({
  label: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  selected: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['leaf-clicked'])

const handleClick = (id, name) => {
  emit('leaf-clicked', id, name)
}
</script>

<style scoped>
.tree-leaf {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: var(--p-form-field-border-radius);
  padding: 0.5rem;
  cursor: pointer;
  border-left: 2px solid transparent;
  background-color: transparent;
  font-size: 0.875rem;
  max-width: 100%;
}

.tree-leaf:hover {
  background-color: var(--p-button-text-primary-hover-background);
}

.tree-leaf:active {
  background-color: var(--p-button-text-primary-active-background);
}

.tree-leaf.selected {
  border-left: 2px solid var(--p-primary-color);
  background-color: var(--p-button-text-primary-active-background);
}

.tree-leaf-icon {
  color: var(--p-text-tertiary-color);
}

.arrow-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.5rem;
  width: 1.5rem;
}

.tree-leaf-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
}
</style>
