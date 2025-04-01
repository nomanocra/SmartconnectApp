<template>
  <div>
    <!-- <Select
      v-model="selectedLanguage"
      :options="languages"
      optionLabel="flag"
      optionValue="code"
      size="small"
    >
      <template #value="">
        <div v-if="slotProps.value" class="flag-container">
          <img
            :alt="getCountryName(slotProps.value)"
            src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
            :class="`flag flag-${slotProps.value.toLowerCase()}`"
          />
        </div>
      </template>
      <template #option="">
        <div class="flag-container">
          <img
            :alt="slotProps.option.name"
            src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
            :class="`flag flag-${slotProps.option.code.toLowerCase()}`"
          />
        </div>
      </template>
    </Select> -->
  </div>
</template>

<script setup>
import Select from 'primevue/select'
import { ref } from 'vue'

const selectedLanguage = ref('en')

const languages = ref([
  { name: 'English', code: 'en' },
  { name: 'Français', code: 'fr' },
])
</script>

<style scoped>
.p-select {
  border: 0px;
  background-color: var(--p-background-lvl3);
}
</style>
