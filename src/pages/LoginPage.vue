<template>
  <div class="login-container">
    <div class="login-card">
      <header class="logo-container">
        <img :src="logoPath" alt="Logo" class="logo" />
      </header>
      <Form @submit="handleLogin" class="form-group">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-user"></i>
          </InputGroupAddon>
          <FloatLabel variant="on">
            <InputText
              id="username"
              name="username"
              type="email"
              fluid
              size="large"
              v-model="email"
              class="login-input"
            />
            <label for="username">User email</label>
          </FloatLabel>
        </InputGroup>

        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-key"></i>
          </InputGroupAddon>
          <FloatLabel variant="on">
            <InputText
              id="password"
              name="password"
              type="password"
              fluid
              size="large"
              v-model="password"
              class="login-input"
            />
            <label for="password">Password</label>
          </FloatLabel>
        </InputGroup>
        <Button type="submit" label="Connexion" size="large" fluid />
      </Form>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import useTheme from '@/utils/useTheme'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { Form } from '@primevue/forms'
import 'primeicons/primeicons.css'
import LogoLight from '@/assets/svgs/Logo_and_Text_Vertical.svg'
import LogoDark from '@/assets/svgs/Logo_and_Text_Vertical_dark.svg'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import FloatLabel from 'primevue/floatlabel'
import ToggleSwitch from 'primevue/toggleswitch'
import LabeledInput from '@/components/LabeledInput.vue'
import CountrySelect from '@/components/CountrySelect.vue'

const { theme, toggleTheme } = useTheme()

const router = useRouter()
const email = ref('')
const password = ref('')

const themeSwitch = computed({
  get: () => theme.value === 'dark',
  set: () => toggleTheme(),
})

const logoPath = computed(() => {
  return theme.value === 'light' ? LogoLight : LogoDark
})

const handleLogin = () => {
  // Pour l'instant, on redirige simplement vers le dashboard
  router.push('/dashboard')
}
</script>

<style scoped>
.login-container {
  height: 100vh;
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
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  padding: 4rem;
  border-radius: 8px;
  width: 100%;
  max-width: 454px;
  backdrop-filter: blur(10px);
  background-color: color-mix(in srgb, var(--p-background-lvl1) 50%, transparent);
}

.form-group {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  padding: 1rem;
  gap: 1.25rem;
}

.logo {
  width: 240px;
}

.login-input,
.p-inputgroupaddon {
  border-radius: 0px;
  border-top: none;
  border-left: none;
  border-right: none;
  background-color: transparent;
  border-inline-start: none !important;
  border-start-start-radius: 0px !important;
  border-end-start-radius: 0px !important;
  border-start-end-radius: 0px !important;
  border-end-end-radius: 0px !important;
}
.p-inputgroupaddon {
  background-color: color-mix(in srgb, var(--p-background-lvl4) 30%, transparent);
}

.p-floatlabel-on label {
  background-color: transparent !important;
}

.footer {
  display: flex;
  align-self: stretch;
  justify-content: space-between;
  align-items: top;
  gap: 1rem;
}
</style>
