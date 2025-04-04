<template>
  <div class="tree-node">
    <div class="tree-node-header" @click="handleClick">
      <i class="pi pi-chevron-right arrow-icon" style="font-size: 0.625rem" />
      <PhMapPin class="tree-node-icon" :size="16" />
      <span style="user-select: none">{{ label }}</span>
    </div>
    <div class="tree-node-content" v-if="open">
      <div class="tree-node-line"></div>
      <div class="tree-node-slot">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PhMapPin } from '@phosphor-icons/vue'
import { ref } from 'vue'

defineProps({
  label: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
})

const open = ref(false)

const handleClick = () => {
  open.value = !open.value
}
</script>

<style scoped>
.tree-node-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  align-self: stretch;
  gap: 0.75rem;
  padding-left: 1.1rem;
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
  transition: transform var(--p-semantic-transition-duration);
}
</style>
