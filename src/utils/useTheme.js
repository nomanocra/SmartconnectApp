import { ref, watch } from 'vue'

const theme = ref(null)
let isInitialized = false

// Define updateThemeBasedOnSystem in the global scope
let updateThemeBasedOnSystem = null

function initTheme() {
  if (isInitialized) return

  // Initialize theme value
  theme.value =
    localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

  // Setup favicon handling
  const favicon = document.getElementById('favicon')

  // Define the function and store it in the global variable
  updateThemeBasedOnSystem = () => {
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

export function destroyTheme() {
  if (isInitialized) {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
    systemTheme.removeEventListener('change', updateThemeBasedOnSystem)
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

export { initTheme }
export default useTheme
