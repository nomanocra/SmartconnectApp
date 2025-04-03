<template>
  <div class="dashboard-page">
    <MainSidebar />
    <RouterView />
  </div>
</template>

<script setup>
import MainSidebar from '@/components/layout/MainSidebar.vue'
</script>

<style scoped>
.dashboard-page {
  background-color: var(--p-background-lvl0);
  display: flex;
  flex-direction: row;
  height: 100vh;
  height: 100dvh; /* Us Fallback for browsers that don't support dvh */
}

.dashboard-container {
  display: flex;
  flex: 1;
  padding: 4rem;
  align-self: stretch;
}

.dashboard-content {
  display: flex;
  flex: 1;
  align-self: stretch;
  padding: 4rem;
  &.lvl1 {
    background-color: var(--p-background-lvl1);
  }
  &.lvl2 {
    background-color: var(--p-background-lvl2);
  }
  &.lvl3 {
    background-color: var(--p-background-lvl3);
  }
  &.lvl4 {
    background-color: var(--p-background-lvl4);
  }
}
</style>
