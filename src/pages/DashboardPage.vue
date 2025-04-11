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

/* Smartphones(portrait) */
@media screen and (max-width: 576px) {
  .dashboard-page {
    flex-direction: column-reverse;
  }
}
</style>
