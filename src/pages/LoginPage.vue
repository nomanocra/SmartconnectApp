<template>
  <div class="login-container">
    <div class="login-card">
      <header class="header">
        <img :src="logoPath" alt="Logo" class="logo" />
      </header>

      <LoginForm />

      <footer class="footer">
        <LabeledInput label="Lang" id="Lang">
          <CountrySelect />
        </LabeledInput>
        <LabeledInput label="Theme" id="theme">
          <ToggleSwitch v-model="themeSwitch" size="large">
            <template #handle>
              <i :class="['!text-xs pi', themeSwitch ? 'pi-moon' : 'pi-sun']" />
            </template>
          </ToggleSwitch>
        </LabeledInput>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import useTheme from '@/utils/useTheme'

import 'primeicons/primeicons.css'
import LogoLight from '@/assets/svgs/Logo_and_Text_Vertical.svg'
import LogoDark from '@/assets/svgs/Logo_and_Text_Vertical_dark.svg'

import ToggleSwitch from 'primevue/toggleswitch'
import LabeledInput from '@/components/LabeledInput.vue'
import CountrySelect from '@/components/CountrySelect.vue'
import LoginForm from '@/components/LoginForm.vue'
const { theme, toggleTheme } = useTheme()

const themeSwitch = computed({
  get: () => theme.value === 'dark',
  set: () => toggleTheme(),
})

const logoPath = computed(() => {
  return theme.value === 'light' ? LogoLight : LogoDark
})
</script>

<style scoped>
.login-container {
  height: 100vh;
  height: 100dvh; /* Us Fallback for browsers that don't support dvh */
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image:
    linear-gradient(
      color-mix(in srgb, var(--p-background-lvl0) 70%, transparent),
      color-mix(in srgb, var(--p-background-lvl0) 70%, transparent)
    ),
    var(--image-login-background);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3rem;
  padding: 4rem;
  border-radius: 8px;
  width: 100%;
  max-width: 440px;
  min-height: 600px;
  backdrop-filter: blur(10px);
  background-color: color-mix(in srgb, var(--p-background-lvl1) 50%, transparent);
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  .logo {
    width: 240px;
  }
}

.footer {
  display: flex;
  align-self: stretch;
  justify-content: space-between;
  align-items: top;
  gap: 1rem;
}

/* Small tablets (portrait) */
@media screen and (max-width: 576px) {
  .login-card {
    max-width: none;
    height: 100%;
    padding: 2rem;
  }

  .login-container {
    justify-content: flex-start;
  }
}
</style>
