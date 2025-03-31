export function setupFaviconTheme() {
  const favicon = document.getElementById('favicon')

  // Initial setup
  updateFaviconByTheme()

  // Watch for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', updateFaviconByTheme)

  function updateFaviconByTheme() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    favicon.href = isDarkMode ? '/favicon_dark.ico' : '/favicon_light.ico'
  }
}
