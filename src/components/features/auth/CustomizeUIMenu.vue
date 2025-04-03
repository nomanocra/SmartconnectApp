<template>
  <Menu ref="menu" :popup="true" :model="items">
    <template #submenulabel="{ item }">
      <span class="subtitle">{{ $t(item.label) }}</span>
    </template>
    <template #item="{ item }">
      <div
        v-if="item.code"
        :class="{
          'p-menuitem-content': true,
          'p-menuitem-selected': locale === item.language,
        }"
        @click="item.onClick"
      >
        <img
          :alt="item.label"
          src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
          :class="`flag flag-${item.code.toLowerCase()}`"
          style="width: 24px; margin-right: 8px"
        />
        <span>{{ $t(item.label) }}</span>
      </div>
      <div
        v-else
        :class="{
          'p-menuitem-content': true,
          'p-menuitem-selected': theme === item.theme.toLowerCase(),
        }"
        @click="item.onClick"
      >
        <i :class="item.icon" style="margin-right: 8px" />
        <span>{{ $t(item.label) }}</span>
      </div>
    </template>
  </Menu>
</template>

<script setup>
import Menu from 'primevue/menu'
import { ref } from 'vue'
import { useTheme } from '@/utils/useTheme'
import useLang from '@/utils/useLang'
const menu = ref()

defineExpose({
  toggle: (event) => {
    menu.value.toggle(event)
  },
})

const { theme, setTheme } = useTheme()
const { locale, setLang } = useLang()

const items = ref([
  {
    label: 'sidebar.theme',
    items: [
      {
        label: 'sidebar.dark',
        theme: 'dark',
        icon: 'pi pi-moon',
        onClick: () => {
          setTheme('dark')
        },
      },
      {
        label: 'sidebar.light',
        theme: 'light',
        icon: 'pi pi-sun',
        onClick: () => {
          setTheme('light')
        },
      },
    ],
  },
  {
    separator: true,
  },
  {
    label: 'sidebar.language',
    items: [
      {
        label: 'sidebar.english',
        code: 'GB',
        language: 'en',
        onClick: () => {
          setLang('en')
        },
      },
      {
        label: 'sidebar.french',
        code: 'FR',
        language: 'fr',
        onClick: () => {
          setLang('fr')
        },
      },
    ],
  },
])
</script>

<style scoped>
.p-menuitem-content {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.p-menuitem-selected {
  background: var(--p-highlight-background);
  color: var(--p-highlight-focus-color);
  pointer-events: none;
  cursor: default;
}
.subtitle {
  font-size: 0.8rem;
  color: var(--p-text-secondary-color);
}
</style>
