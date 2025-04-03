<template>
  <header class="main-sidebar">
    <div class="sidebar-header">
      <img src="@/assets/svgs/logo.svg" alt="Logo" />
    </div>
    <nav class="sidebar-nav">
      <Button
        icon="pi pi-gauge"
        aria-label="Monitoring"
        variant="text"
        v-tooltip="$t('sidebar.monitoring')"
        class="selected"
      />
      <Button
        icon="pi pi-chart-bar"
        aria-label="Analytics"
        variant="text"
        v-tooltip="$t('sidebar.analytics')"
      />
      <Button
        icon="pi pi-cog"
        aria-label="Settings"
        variant="text"
        v-tooltip="$t('sidebar.settings')"
      />
    </nav>
    <div class="sidebar-footer">
      <Button
        icon="pi pi-sliders-h"
        aria-label="Sign Out"
        variant="text"
        v-tooltip="$t('sidebar.customizeUI')"
        @click="toggleCustomizeUIMenu"
      />
      <CustomizeUIMenuContent ref="customizeUIMenu" />

      <Button
        icon="pi pi-sign-out"
        aria-label="Sign Out"
        variant="text"
        @click="handleSignOut"
        v-tooltip="$t('login.signOut')"
      />
    </div>
  </header>
</template>

<script setup>
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import CustomizeUIMenuContent from '@/components/features/auth/CustomizeUIMenu.vue'
const router = useRouter()

const customizeUIMenu = ref()

function handleSignOut() {
  router.push('/')
}

function toggleCustomizeUIMenu(event) {
  customizeUIMenu.value.toggle(event)
}
</script>

<style scoped>
.main-sidebar {
  --sidebar-width: 4rem;
  width: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: var(--p-background-lvl1);
  /* border-right: 1px solid var(--p-border-lvl1); */
}

.sidebar-header {
  width: auto;
  height: var(--sidebar-width);
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 1.75rem;
    height: auto;
  }
}

.sidebar-nav {
  flex: 1;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0.5rem 1rem 0.5rem;
}

.selected {
  background-color: var(--p-button-text-primary-active-background);
  pointer-events: none;
}
</style>
