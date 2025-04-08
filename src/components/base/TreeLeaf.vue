<template>
  <div class="tree-leaf" @click="handleClick(id)">
    <PhHardDrive class="tree-leaf-icon" :size="16" />
    <span>{{ label }}</span>
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

const emit = defineEmits(['click'])

const handleClick = (id) => {
  emit('click', id)
}
</script>

<style scoped>
.tree-leaf {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: var(--p-border-radius-sm);
  padding: 0.5rem;
  cursor: pointer;
  border-left: 2px solid v-bind(selected ? 'var(--p-primary-color)': 'transparent');
  background-color: v-bind(
    selected ? 'var(--p-button-text-primary-active-background)': 'transparent'
  );
  &:hover {
    background-color: var(--p-button-text-primary-hover-background);
  }
  &:active {
    background-color: var(--p-button-text-primary-active-background);
  }
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
</style>
