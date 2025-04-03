import { useI18n } from 'vue-i18n'
import router from '../router'
import { watch } from 'vue'

// Variable pour stocker les fonctions de nettoyage
let cleanupFunctions = []

export function destroyPageNameManagement() {
  // Exécuter toutes les fonctions de nettoyage
  cleanupFunctions.forEach((cleanup) => cleanup())
  // Réinitialiser le tableau
  cleanupFunctions = []
}

// Modification de la fonction initPageNameManagement pour capturer les watchers
export function initPageNameManagement() {
  const i18n = useI18n()

  // Mettre à jour le titre de la page en fonction de la route
  const updateTitle = (to) => {
    if (to.meta.titleKey) {
      document.title = i18n.t(to.meta.titleKey)
    } else {
      document.title = 'SmartConnect'
    }
  }

  // Appliquer le titre pour la route initiale
  updateTitle(router.currentRoute.value)

  // Écouter les changements de route
  const routerUnwatch = router.afterEach((to) => {
    updateTitle(to)
  })

  // Ajouter la fonction de nettoyage pour le router
  cleanupFunctions.push(() => {
    if (routerUnwatch) routerUnwatch()
  })

  // Mettre à jour le titre lorsque la langue change
  i18n.locale.value = localStorage.getItem('language') || i18n.locale.value

  const localeUnwatch = watch(
    () => i18n.locale.value,
    () => {
      // Sauvegarder la langue sélectionnée
      localStorage.setItem('language', i18n.locale.value)
      // Mettre à jour le titre avec la nouvelle langue
      updateTitle(router.currentRoute.value)
    },
  )

  // Ajouter la fonction de nettoyage pour le watcher de locale
  cleanupFunctions.push(localeUnwatch)
}
