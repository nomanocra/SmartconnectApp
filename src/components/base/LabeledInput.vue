<template>
  <div class="labeled-input">
    <label :for="id" class="labeled-input__label">{{ label }}</label>
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
}

.labeled-input__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--p-text-secondary-color);
}
</style>
