<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Connexion</h1>
      <Form @submit="handleLogin" class="form-group">
        <InputText
          name="username"
          type="email"
          placeholder="Username"
          fluid
          size="large"
          v-model="email"
        />
        <InputText
          name="username"
          type="password"
          placeholder="Password"
          fluid
          size="large"
          v-model="password"
        />
        <Button type="submit" label="Connexion" size="large" fluid />
      </Form>
    </div>
    <Button
      @click="toggleTheme"
      :aria-label="theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'"
      size="large"
      class="theme-toggle"
      icon="pi pi-moon"
      :label="theme === 'light' ? 'Mode sombre' : 'Mode clair'"
    >
    </Button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useTheme from '../utils/useTheme'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { Form } from '@primevue/forms'
import 'primeicons/primeicons.css'

const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = () => {
  // Pour l'instant, on redirige simplement vers le dashboard
  router.push('/dashboard')
}

const { theme, toggleTheme } = useTheme()
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url('../assets/images/login_background-min.jpg');
  background-size: cover;
  background-position: center;
}

.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  background-color: var(--surface-login-card);
}

.form-group {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  padding: 1rem;
  gap: 0.8rem;
}
</style>
