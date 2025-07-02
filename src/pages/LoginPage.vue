<template>
  <div class="login-container">
    <div class="login-card">
      <header class="header">
        <div class="logo" role="img" aria-label="Smart Connect Logo" />
      </header>

      <LoginForm />

      <footer class="footer">
        <LabeledInput label="Lang" id="Lang">
          <CountrySelect />
        </LabeledInput>
        <LabeledInput label="Theme" id="theme">
          <ThemeSwitch />
        </LabeledInput>
      </footer>
    </div>
  </div>
</template>

<script setup>
import LabeledInput from '@/components/base/LabeledInput.vue'
import CountrySelect from '@/components/base/CountrySelect.vue'
import LoginForm from '@/components/features/LoginForm.vue'
import ThemeSwitch from '@/components/base/ThemeSwitch.vue'
import { useToast } from 'primevue/usetoast'
import { config } from '@/utils/config'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const videoRef = ref(null)
const toast = useToast()

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.playbackRate = 0.5
  }
  if (config.demoVersion) {
    setTimeout(() => {
      toast.add({
        severity: 'secondary',
        summary: 'You are using a demo version of SmartBoard',
        icon: 'pi pi-exclamation-circle',
        detail: 'email: demo@smartconnectiot.com \npassword: demo1234',
        group: 'tr',
        closable: true,
      })
    }, 500)
  }
})

onBeforeUnmount(() => {
  // Supprimer tous les toasts du groupe 'tr' (top-right)
  toast.removeAllGroups()
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
  border-radius: var(--p-form-field-border-radius);
  width: 100%;
  max-width: 480px;
  min-height: 600px;
  backdrop-filter: blur(10px);
  background-color: color-mix(in srgb, var(--p-background-lvl1) 50%, transparent);
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  .logo {
    width: 200px;
    height: 140px;
    background-image: var(--image-login-logo);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
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
