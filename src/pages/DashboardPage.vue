<template>
  <h1>Dashboard</h1>
  <button @click="toggleTheme">Toggle Theme</button>
</template>

<script setup>
import { useTheme } from '@/utils/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<style scoped>
.dashboard-container {
  background-color: var(--p-background-lvl0);
}
</style>
