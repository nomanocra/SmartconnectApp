import { ref, computed } from 'vue'
const breakpoints = {
  mobile: 576,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
}

const windowWidth = ref(window.innerWidth)

export const isMobile = computed(() => windowWidth.value < breakpoints.mobile)
export const isTablet = computed(() => windowWidth.value < breakpoints.tablet)
export const isDesktop = computed(() => windowWidth.value < breakpoints.desktop)
export const isWide = computed(() => windowWidth.value < breakpoints.wide)

// Mettre à jour la largeur de la fenêtre lors du redimensionnement
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

window.addEventListener('resize', handleResize)
