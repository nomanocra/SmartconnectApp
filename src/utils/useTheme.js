import { ref, watch } from 'vue'
export function useTheme() {
  const theme = ref(localStorage.getItem('theme') || 'dark')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  watch(theme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  })

  // Initialize theme
  document.documentElement.setAttribute('data-theme', theme.value)

  return {
    theme,
    toggleTheme,
  }
}

export default useTheme
