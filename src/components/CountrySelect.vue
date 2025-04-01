<template>
  <div>
    <Select v-model="selectedLanguage" :options="languages" size="small">
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
import { ref } from 'vue'

const languages = ref([
  { name: 'English', code: 'FR' },
  { name: 'Français', code: 'GB' },
])

const selectedLanguage = ref(languages.value[0])
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
