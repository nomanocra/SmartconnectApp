<template>
  <div>
    <Select
      :modelValue="selectedLanguage"
      @update:modelValue="handleLanguageChange"
      :options="languages"
      size="small"
    >
      <template #value="slotProps">
        <img
          v-if="slotProps.value"
          src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
          :class="`flag flag-${slotProps.value.code.toLowerCase()}`"
          style="width: 24px"
        />
      </template>
      <template #option="slotProps">
        <img
          :alt="slotProps.option.label"
          src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
          :class="`flag flag-${slotProps.option.code.toLowerCase()}`"
          style="width: 24px"
        />
      </template>

      <template #dropdownicon>
        <i class="pi pi-sort-down-fill" style="font-size: 0.6rem" />
      </template>
    </Select>
  </div>
</template>

<script setup>
import Select from 'primevue/select'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const languages = ref([
  { name: 'fr', code: 'FR' },
  { name: 'en', code: 'GB' },
])

const { locale } = useI18n()

const selectedLanguage = computed(
  () => {
    return languages.value.find((language) => language.name === locale.value)
  },
  {
    immediate: true,
  },
)

const handleLanguageChange = (value) => {
  // Mettre à jour la locale
  locale.value = value.name

  // Sauvegarder la préférence de langue dans le localStorage
  localStorage.setItem('language', value.name)
}
</script>

<style scoped>
.p-select {
  border: 0px;
  background-color: var(--p-background-lvl3);
  width: 4rem;
}

/* Correction de la classe pour le dropdown */
:deep(.p-select-dropdown) {
  width: 1.75rem;
  background-color: var(--p-background-lvl3);
}

/* Pour réduire la taille des options */
:deep(.p-select-label) {
  width: 3rem;
}
</style>
