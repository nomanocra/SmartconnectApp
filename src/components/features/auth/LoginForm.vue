<template>
  <Form @submit="handleLogin" class="form-group">
    <div class="login-header">
      <span class="login-title">{{ $t('login.title') }}</span>
      <span class="login-subtitle">{{ $t('login.loginSubtitle') }}</span>
    </div>
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
        <label for="username">{{ $t('login.emailAdress') }}</label>
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
        <label for="password">{{ $t('login.password') }}</label>
      </FloatLabel>
    </InputGroup>
    <Button type="submit" :label="$t('login.loginButton')" size="large" fluid />
  </Form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { Form } from '@primevue/forms'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import FloatLabel from 'primevue/floatlabel'
const email = ref('')
const password = ref('')

const router = useRouter()

const handleLogin = () => {
  // Pour l'instant, on redirige simplement vers le dashboard
  router.push('/dashboard')
}
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 1.5rem;
}

.login-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--p-text-color);
}

.login-subtitle {
  font-size: 0.875rem;
  font-weight: 300;
  color: var(--p-text-secondary-color);
}

.login-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
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
  /* background-color: color-mix(in srgb, var(--p-background-lvl4) 30%, transparent); */
}

.p-floatlabel-on label {
  background-color: transparent !important;
}
</style>
