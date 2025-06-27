<template>
  <div class="labeled-input">
    <div class="label-container">
      <slot name="icon" class="icon" />
      <label :for="id">{{ label }}</label>
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  id: String,
})
</script>

<style scoped>
.labeled-input {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  .label-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
  label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-text-secondary-color);
  }
}
</style>
