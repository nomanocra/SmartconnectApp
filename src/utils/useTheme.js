import { ref, watch } from 'vue'

const theme = ref(null)
let isInitialized = false
let favicon = document.getElementById('favicon')
let themeWatcher = null

function initTheme() {
  if (isInitialized) return

  // Initialize theme value
  theme.value =
    localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

  // Watch for system theme changes
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
  systemTheme.addEventListener('change', updateThemeBasedOnSystem)

  // Initial tab iconColor
  updateTabIcon(systemTheme.matches)

  // Setup theme watcher
  themeWatcher = watch(theme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  })

  // Initialize theme on document
  document.documentElement.setAttribute('data-theme', theme.value)

  isInitialized = true
}

export function destroyTheme() {
  if (isInitialized) {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
    systemTheme.removeEventListener('change', updateThemeBasedOnSystem)
    if (themeWatcher) {
      themeWatcher()
      themeWatcher = null
    }
    isInitialized = false
  }
}

export function useTheme() {
  if (!isInitialized) {
    console.warn('Theme not initialized. Call initTheme() first.')
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (newTheme) => {
    if (newTheme && ['light', 'dark'].includes(newTheme)) {
      theme.value = newTheme
    } else {
      console.warn('Invalid theme value. Use "light" or "dark"')
    }
  }

  return {
    theme,
    toggleTheme,
    setTheme,
  }
}

// Set the Icon of the tab based on the system theme
function updateTabIcon(isDarkMode) {
  if (favicon) {
    favicon.href = isDarkMode ? '/favicon_dark.ico' : '/favicon_light.ico'
  }
}

// Set the theme based on the system theme
function updateThemeBasedOnSystem() {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
  updateTabIcon(isDarkMode)
  theme.value = isDarkMode ? 'dark' : 'light'
}

export { initTheme }
export default useTheme
