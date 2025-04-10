<template>
  <div class="tree-node">
    <div class="tree-node-header" @click="handleHeaderClick">
      <i class="pi pi-chevron-right arrow-icon" style="font-size: 0.625rem" />
      <span style="user-select: none">{{ label }}</span>
    </div>
    <div class="tree-node-content">
      <div class="tree-node-line"></div>
      <div class="tree-node-slot">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  label: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: false,
  },
})

// Définir les événements que le composant peut émettre
const emit = defineEmits(['click'])

const open = ref(false)

const handleHeaderClick = () => {
  open.value = !open.value
  emit('click')
}
</script>

<style scoped>
.tree-node {
  display: grid;
  grid-template-rows: 36px v-bind('open ? "1fr" : "0fr"');
  overflow: hidden;
  transition: 0.2s ease-in-out;
  align-content: top;
  font-size: 0.875rem;
}

.tree-node-header {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: var(--p-border-radius-sm);
  padding: 0.375rem;
  &:hover {
    background-color: var(--p-button-text-primary-hover-background);
  }
  &:active {
    background-color: var(--p-button-text-primary-active-background);
  }
}

.tree-node-content {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  padding-left: 1.1rem;
  overflow: hidden;
}

.tree-node-line {
  width: 1px;
  align-self: stretch;
  background-color: var(--p-border-lvl2);
}

.tree-node-slot {
  align-self: stretch;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.tree-node-icon {
  color: var(--p-text-tertiary-color);
}

.arrow-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.5rem;
  width: 1.5rem;
  transform: v-bind('open ? "rotate(90deg)" : "rotate(0deg)"');
  transition: 0.1s ease-in-out;
}
</style>
