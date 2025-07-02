import { useI18n } from 'vue-i18n'

// Créer une fonction composable
export function useLang() {
  const i18n = useI18n()

  // Vos fonctions et logique
  const setLang = (newLocale) => {
    if (i18n && i18n.locale) {
      i18n.locale.value = newLocale
      localStorage.setItem('language', newLocale)
    } else {
      console.error('i18n or i18n.locale is not defined')
    }
  }

  return {
    locale: i18n.locale,
    setLang,
  }
}

export default useLang
