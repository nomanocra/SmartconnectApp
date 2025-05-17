<template>
  <header class="main-sidebar">
    <div class="sidebar-header">
      <div class="logo" role="img" aria-label="Smart Connect Logo" />
    </div>
    <nav class="sidebar-nav">
      <Button
        v-if="!isMobile"
        icon="pi pi-gauge"
        aria-label="Monitoring"
        variant="text"
        v-tooltip="$t('sidebar.monitoring')"
        :class="currentRoute === 'monitoring' ? 'selected' : ''"
        class="sidebar-button"
        @click="handleMonitoring"
      />
      <Button
        v-else
        icon="pi pi-gauge"
        aria-label="Monitoring"
        variant="text"
        :class="currentRoute === 'monitoring' ? 'selected' : ''"
        class="sidebar-button"
        @click="handleMonitoring"
      />
      <Button
        v-if="!isMobile"
        icon="pi pi-chart-bar"
        aria-label="Analytics"
        variant="text"
        v-tooltip="$t('sidebar.analytics')"
        :class="currentRoute === 'analytics' ? 'selected' : ''"
        class="sidebar-button"
        @click="handleAnalytics"
      />
      <Button
        v-else
        icon="pi pi-chart-bar"
        aria-label="Analytics"
        variant="text"
        :class="currentRoute === 'analytics' ? 'selected' : ''"
        class="sidebar-button"
        @click="handleAnalytics"
      />
      <Button
        v-if="!isMobile"
        icon="pi pi-cog"
        aria-label="Settings"
        variant="text"
        v-tooltip="$t('sidebar.settings')"
        :class="currentRoute === 'settings' ? 'selected' : ''"
        class="sidebar-button"
        @click="handleSettings"
      />
      <Button
        v-else
        icon="pi pi-cog"
        aria-label="Settings"
        variant="text"
        :class="currentRoute === 'settings' ? 'selected' : ''"
        class="sidebar-button"
        @click="handleSettings"
      />
    </nav>
    <div class="sidebar-footer">
      <Button
        v-if="!isMobile"
        icon="pi pi-sliders-h"
        aria-label="Sign Out"
        variant="text"
        v-tooltip="$t('sidebar.customizeUI')"
        class="sidebar-button"
        @click="toggleCustomizeUIMenu"
      />
      <Button
        v-else
        icon="pi pi-sliders-h"
        aria-label="Sign Out"
        variant="text"
        class="sidebar-button"
        @click="toggleCustomizeUIMenu"
      />
      <CustomizeUIMenuContent ref="customizeUIMenu" />

      <Button
        v-if="!isMobile"
        icon="pi pi-sign-out"
        aria-label="Sign Out"
        variant="text"
        class="sidebar-button"
        @click="handleSignOut"
        v-tooltip="$t('login.signOut')"
      />
      <Button
        v-else
        icon="pi pi-sign-out"
        aria-label="Sign Out"
        variant="text"
        class="sidebar-button"
        @click="handleSignOut"
      />
    </div>
  </header>
</template>

<script setup>
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import CustomizeUIMenuContent from '@/components/features/CustomizeUIMenu.vue'
import { isMobile } from '@/assets/styles/tokens/breakpoints'
import { useAuth } from '@/utils/authService'

const router = useRouter()
const customizeUIMenu = ref()
const { logout } = useAuth()
const currentRoute = computed(() => router.currentRoute.value.name)

function handleSignOut() {
  logout()
  router.push('/login')
}

function handleMonitoring() {
  router.push('/dashboard/monitoring')
}

function handleAnalytics() {
  router.push('/dashboard/analytics')
}

function handleSettings() {
  router.push('/dashboard/settings')
}

function toggleCustomizeUIMenu(event) {
  customizeUIMenu.value.toggle(event)
}
</script>

<style scoped>
.main-sidebar {
  --sidebar-width: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: var(--p-background-lvl1);
  box-shadow: inset -1px 0 0 var(--p-border-lvl1);
}

.sidebar-header {
  width: auto;
  height: var(--sidebar-width);
  display: flex;
  align-items: center;
  justify-content: center;
  .logo {
    width: 1.75rem;
    height: 1.75rem;
    background-image: var(--image-dashboard-logo);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}

.sidebar-nav {
  flex: 1;
  padding: var(--size-content-padding-xs);
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

/* Smartphones(portrait) */
@media screen and (max-width: 576px) {
  .main-sidebar {
    flex-direction: row;
    border-right: none;
    border-top: 1px solid var(--p-border-lvl2);
  }
  .sidebar-header {
    display: none;
  }
  .sidebar-nav {
    flex-direction: row;
    justify-content: space-evenly;
    order: 1;
    flex: 3;
  }
  .sidebar-footer {
    flex-direction: row;
    justify-content: space-evenly;
    flex: 2;
    order: 3;
    padding: 0.5rem;
  }
  .sidebar-button {
    flex: 1;
  }
}
</style>
