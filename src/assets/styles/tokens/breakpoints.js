import { ref, computed } from 'vue'
const breakpoints = {
  mobile: 576,
  tablet: 904,
  desktop: 1280,
}

const windowWidth = ref(window.innerWidth)

export const isMobile = computed(() => windowWidth.value < breakpoints.mobile)
export const isTablet = computed(() => windowWidth.value < breakpoints.tablet)
export const isDesktop = computed(() => windowWidth.value < breakpoints.desktop)
export const isWide = computed(() => windowWidth.value >= breakpoints.desktop)

// Détection du type de pointeur
export const hasHover = computed(() => window.matchMedia('(hover: hover)').matches)
export const hasFinePointer = computed(() => window.matchMedia('(pointer: fine)').matches)
export const hasCoarsePointer = computed(() => window.matchMedia('(pointer: coarse)').matches)
export const hasNoPointer = computed(() => window.matchMedia('(pointer: none)').matches)

// Fonction utilitaire pour détecter si l'utilisateur utilise une souris
export const usesMouse = computed(() => hasHover.value && hasFinePointer.value)

// Fonction utilitaire pour détecter si l'utilisateur utilise un écran tactile
export const usesTouch = computed(
  () => hasCoarsePointer.value || (!hasHover.value && hasFinePointer.value),
)

// Mettre à jour la largeur de la fenêtre lors du redimensionnement
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

window.addEventListener('resize', handleResize)
