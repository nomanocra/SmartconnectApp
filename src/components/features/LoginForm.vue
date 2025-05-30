<template>
  <Form @submit="handleLogin" class="form-group">
    <div class="login-header">
      <span class="login-title">{{ $t('login.title') }}</span>
      <span class="login-subtitle">{{ $t('login.loginSubtitle') }}</span>
    </div>
    <InputGroup>
      <InputGroupAddon :class="{ 'inputgroupaddon-error': connectionHasFailed }">
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
          :invalid="connectionHasFailed"
        />
        <label for="username">{{ $t('login.emailAdress') }}</label>
      </FloatLabel>
    </InputGroup>

    <InputGroup>
      <InputGroupAddon :class="{ 'inputgroupaddon-error': connectionHasFailed }">
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
          :invalid="connectionHasFailed"
        />
        <label for="password">{{ $t('login.password') }}</label>
      </FloatLabel>
    </InputGroup>
    <Button
      type="submit"
      :label="connectionIsLoading ? $t('login.loginButtonLoading') : $t('login.loginButton')"
      :loading="connectionIsLoading"
      size="large"
      fluid
      :disabled="password.length === 0 || email.length === 0"
    />
    <Message v-if="connectionHasFailed" severity="error">
      {{ $t('login.loginError') }}
    </Message>
  </Form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Form } from '@primevue/forms'
import { useAuth } from '@/utils/authService'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import FloatLabel from 'primevue/floatlabel'
import Message from 'primevue/message'

const email = ref('')
const password = ref('')

const router = useRouter()
const { login } = useAuth()

const loginResponse = ref(null)
const connectionIsLoading = computed(() => loginResponse.value === 'loading')
const connectionHasFailed = computed(() => loginResponse.value === 'error')

const handleLogin = async () => {
  loginResponse.value = 'loading'
  const response = await login({ email: email.value, password: password.value })
  if (response.success) {
    loginResponse.value = 'success'
    router.push('/dashboard')
  } else {
    loginResponse.value = 'error'
    console.error(response.error)
  }
}
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 1.25rem;
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
.inputgroupaddon-error {
  border-bottom: 1px solid var(--p-inputtext-invalid-border-color);
}

.p-floatlabel-on label {
  background-color: transparent !important;
}
</style>
