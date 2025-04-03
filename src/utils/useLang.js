import { useI18n } from 'vue-i18n'

// Créer une fonction composable
export function useLang() {
  const i18n = useI18n()

  // Vos fonctions et logique
  const setLang = (newLocale) => {
    console.log('setLang newLocale', newLocale)
    if (i18n && i18n.locale) {
      i18n.locale.value = newLocale
      console.log('lang setted:' + i18n.locale.value)
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
