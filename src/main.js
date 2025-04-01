import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import { SmartTheme } from './assets/styles/tokens/SmartTheme'
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

// app.use(PrimeVue, { unstyled: true })
app.use(router)
app.mount('#app')
