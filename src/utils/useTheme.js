import { ref, watch } from 'vue'

const theme = ref(null)
let isInitialized = false

function initTheme() {
  if (isInitialized) return

  // Initialize theme value
  theme.value =
    localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

  // Setup favicon handling
  const favicon = document.getElementById('favicon')

  function updateThemeBasedOnSystem() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (favicon) {
      favicon.href = isDarkMode ? '/favicon_dark.ico' : '/favicon_light.ico'
    }
    theme.value = isDarkMode ? 'dark' : 'light'
  }

  // Initial setup
  updateThemeBasedOnSystem()

  // Watch for system theme changes
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
  systemTheme.addEventListener('change', updateThemeBasedOnSystem)

  // Setup theme watcher
  watch(theme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  })

  // Initialize theme on document
  document.documentElement.setAttribute('data-theme', theme.value)

  isInitialized = true
}

export function useTheme() {
  if (!isInitialized) {
    console.warn('Theme not initialized. Call initTheme() first.')
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return {
    theme,
    toggleTheme,
  }
}

export { initTheme }
export default useTheme
