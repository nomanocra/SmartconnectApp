import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import { SmartTheme } from './assets/styles/SmartTheme'
import { createI18n } from 'vue-i18n'
import i18nSettings from './lang/i18n-settings'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

const MyPreset = definePreset(Aura, SmartTheme)

app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '[data-theme="dark"]',
    },
  },
})

// Récupérer la langue du système
const getSystemLanguage = () => {
  // On vérifie d'abord si une langue est stockée dans le localStorage
  const storedLanguage = localStorage.getItem('language')
  if (storedLanguage && ['fr', 'en'].includes(storedLanguage)) {
    return storedLanguage
  }
  const browserLang = navigator.language.split('-')[0] // 'fr-FR' devient 'fr'
  // On vérifie si la langue du système est supportée, sinon on utilise 'en' par défaut
  return ['fr', 'en'].includes(browserLang) ? browserLang : 'en'
}

const i18n = createI18n({
  locale: getSystemLanguage(),
  fallbackLocale: 'en',
  messages: i18nSettings,
})

// app.use(PrimeVue, { unstyled: true })
app.use(i18n)
app.use(router)
app.use(ToastService)
app.directive('tooltip', Tooltip)
app.mount('#app')
