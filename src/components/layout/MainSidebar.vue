<template>
  <header class="main-sidebar">
    <div class="sidebar-header"></div>
    <nav class="sidebar-nav">
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
    <div class="sidebar-footer">
      <CountrySelect />
      <ThemeSwitch />
    </div>
  </header>
</template>

<script setup>
import ThemeSwitch from '@/components/base/ThemeSwitch.vue'
import CountrySelect from '@/components/base/CountrySelect.vue'
</script>

<style scoped>
.main-sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: var(--p-background-lvl1);
}

.sidebar-header {
  width: 100%;
  height: 80px;
  background-color: var(--p-primary-900);
}
.sidebar-nav {
  flex: 1;
  padding: 0.5rem;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
}
</style>
