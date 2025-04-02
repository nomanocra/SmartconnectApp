<template>
  <ToggleSwitch v-model="themeSwitch" :size="size">
    <template #handle>
      <i :class="['!text-xs pi', themeSwitch ? 'pi-moon' : 'pi-sun']" />
    </template>
  </ToggleSwitch>
</template>

<script setup>
import { computed } from 'vue'
import useTheme from '@/utils/useTheme'
import ToggleSwitch from 'primevue/toggleswitch'
const { theme, toggleTheme } = useTheme()

const themeSwitch = computed({
  get: () => theme.value === 'dark',
  set: () => toggleTheme(),
})

defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
})
</script>

<style scoped></style>
