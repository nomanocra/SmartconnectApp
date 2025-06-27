import i18nSettings from '@/lang/i18n-settings'

// Fonction pour obtenir la langue actuelle depuis localStorage
const getCurrentLocale = () => {
  const storedLanguage = localStorage.getItem('language')
  if (storedLanguage && ['fr', 'en'].includes(storedLanguage)) {
    return storedLanguage
  }
  const browserLang = navigator.language.split('-')[0]
  return ['fr', 'en'].includes(browserLang) ? browserLang : 'en'
}

// Fonction pour traduire une clé
export const t = (key) => {
  const locale = getCurrentLocale()
  const keys = key.split('.')
  let value = i18nSettings[locale]

  for (const k of keys) {
    if (value && value[k]) {
      value = value[k]
    } else {
      // Fallback vers l'anglais si la clé n'existe pas dans la langue actuelle
      value = i18nSettings.en
      for (const fallbackKey of keys) {
        if (value && value[fallbackKey]) {
          value = value[fallbackKey]
        } else {
          return key // Retourner la clé si aucune traduction n'est trouvée
        }
      }
      break
    }
  }

  return value || key
}
