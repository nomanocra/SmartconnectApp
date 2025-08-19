<template>
  <Form @submit="handleAddDevice" class="form-group">
    <div class="section-container">
      <div class="section-container-header">
        <PhInfo :size="16" color="var(--p-primary-color)" />
        <label>{{ $t('addDevice.deviceInfo') }}</label>
      </div>
      <div class="section-container-body">
        <LabeledInput :label="$t('addDevice.deviceName')" id="deviceName">
          <template #icon>
            <PhHardDrive :size="14" color="var(--p-primary-color)" />
          </template>
          <InputText v-model="deviceName" type="text" placeholder="Building Floor1" />
        </LabeledInput>
        <LabeledInput :label="$t('addDevice.deviceAddress')" id="deviceAddress">
          <template #icon>
            <PhGlobeSimple :size="14" color="var(--p-primary-color)" />
          </template>
          <AutoComplete
            v-model="deviceAddress"
            :suggestions="filteredDeviceAddresses"
            @complete="searchDeviceAddresses"
            placeholder="192.168.1.100"
            :delay="300"
            :minLength="1"
            :loading="isDeviceHistoryLoading"
            :emptySearchMessage="emptyMessage"
          />
        </LabeledInput>
      </div>
    </div>
    <div class="section-container">
      <div class="section-container-header">
        <PhShieldCheck :size="16" color="var(--p-primary-color)" />
        <label>{{ $t('addDevice.deviceAuth') }}</label>
      </div>
      <div class="section-container-body">
        <LabeledInput :label="$t('addDevice.deviceLogin')" id="deviceLogin">
          <template #icon>
            <PhUser :size="14" color="var(--p-primary-color)" />
          </template>
          <InputText
            v-model="deviceLogin"
            type="text"
            placeholder="Admin"
            autocomplete="username"
          />
        </LabeledInput>
        <LabeledInput :label="$t('addDevice.devicePassword')" id="devicePassword">
          <template #icon>
            <PhLock :size="14" color="var(--p-primary-color)" />
          </template>
          <InputText
            v-model="devicePassword"
            type="password"
            autocomplete="new-password"
            placeholder="••••••••"
          />
        </LabeledInput>
      </div>
    </div>
    <div class="section-container">
      <div class="section-container-header">
        <PhUpload :size="16" color="var(--p-primary-color)" />
        <label>{{ $t('addDevice.deviceDataLoadingSettings') }}</label>
      </div>
      <div class="section-container-body">
        <LabeledInput :label="$t('addDevice.deviceInitialHistory')" id="deviceInitialHistory">
          <template #icon>
            <PhClockCounterClockwise :size="14" color="var(--p-primary-color)" />
          </template>
          <SelectButton
            v-model="deviceInitialHistory"
            :options="deviceInitialHistoryOptions"
            optionLabel="label"
            optionValue="value"
            size="small"
          />
        </LabeledInput>
        <LabeledInput :label="$t('addDevice.deviceRefreshInterval')" id="devicePullInterval">
          <template #icon>
            <PhArrowsCounterClockwise :size="14" color="var(--p-primary-color)" />
          </template>
          <SelectButton
            v-model="deviceRefreshInterval"
            :options="deviceRefreshIntervalOptions"
            optionLabel="label"
            optionValue="value"
            size="small"
          />
        </LabeledInput>
      </div>
    </div>
    <Button
      type="submit"
      :label="
        isButtonLoading ? $t('addDevice.deviceAddButtonLoading') : $t('addDevice.deviceAddButton')
      "
      icon="pi pi-plus"
      :loading="isButtonLoading"
      :disabled="!deviceName || !deviceAddress || !deviceLogin || !devicePassword"
    />
  </Form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import AutoComplete from 'primevue/autocomplete'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import LabeledInput from '@/components/base/LabeledInput.vue'

import {
  PhUpload,
  PhShieldCheck,
  PhInfo,
  PhArrowsCounterClockwise,
  PhClockCounterClockwise,
  PhUser,
  PhLock,
  PhGlobeSimple,
  PhHardDrive,
} from '@phosphor-icons/vue'
import fetchData from '@/utils/fetcherAPI'
import { config } from '@/utils/config'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

const deviceName = ref('')
const deviceAddress = ref('')
const deviceLogin = ref('')
const devicePassword = ref('')
const addDeviceStatus = ref(null)
const addDeviceResponse = ref(null)

// États pour l'historique des appareils
const deviceHistoryStatus = ref(null)
const deviceHistoryResponse = ref(null)
const deviceHistoryAddresses = ref([])

// État de chargement pour l'historique des appareils
const isDeviceHistoryLoading = computed(() => {
  return deviceHistoryStatus.value === 'loading'
})

// Message personnalisé pour l'AutoComplete
const emptyMessage = computed(() => {
  if (deviceHistoryStatus.value === 'loading') {
    return t('addDevice.loadingMessage')
  }
  return t('addDevice.noResultsMessage')
})

const filteredDeviceAddresses = ref([])

// Fonction pour récupérer l'historique des appareils
const fetchDeviceHistory = () => {
  fetchData(`${config.apiBaseUrl}/users/device-history`, {
    method: 'GET',
    status: deviceHistoryStatus,
    fetchedResponse: deviceHistoryResponse,
    requiresAuth: true,
  })
}

// Fonction de filtrage pour l'autosuggestion d'adresses IP
const searchDeviceAddresses = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredDeviceAddresses.value = [...deviceHistoryAddresses.value]
    } else {
      filteredDeviceAddresses.value = deviceHistoryAddresses.value.filter((address) => {
        return address.toLowerCase().includes(event.query.toLowerCase())
      })
    }
  }, 250)
}
// Charger l'historique des appareils au montage du composant
onMounted(() => {
  fetchDeviceHistory()
})

// Surveiller les erreurs de l'historique des appareils
watch(
  () => deviceHistoryStatus.value,
  (newStatus) => {
    if (newStatus === 'error') {
      console.warn("Impossible de charger l'historique des appareils:", deviceHistoryResponse.value)
      // En cas d'erreur, on peut utiliser une liste de fallback ou laisser vide
      deviceHistoryAddresses.value = []
    } else if (newStatus === 'loaded') {
      deviceHistoryAddresses.value = deviceHistoryResponse.value.data
    }
  },
  { immediate: true },
)

const emit = defineEmits(['device-added'])

const isButtonLoading = computed(() => {
  return addDeviceStatus.value === 'loading'
})

const toast = useToast()
const { t } = useI18n()

const deviceRefreshIntervalOptions = ref([
  { label: t('addDevice.fiveMinutes'), value: 5 },
  { label: t('addDevice.tenMinutes'), value: 10 },
  { label: t('addDevice.twentyMinutes'), value: 20 },
  { label: t('addDevice.oneHour'), value: 60 },
])
const deviceRefreshInterval = ref(10)

const deviceInitialHistoryOptions = ref([
  { label: t('addDevice.none'), value: 0 },
  { label: t('addDevice.oneHour'), value: 1 },
  { label: t('addDevice.fourHours'), value: 2 },
  { label: t('addDevice.today'), value: 3 },
])

const deviceInitialHistory = ref(1)

const handleAddDevice = () => {
  const now = new Date()

  let startYear = now.getFullYear()
  let startMonth = now.getMonth() + 1
  let startDay = now.getDate()
  let startHour = now.getHours()
  let startMin = now.getMinutes()
  let startSec = now.getSeconds()

  switch (deviceInitialHistory.value) {
    case 0:
      break
    case 1:
      startHour = startHour - 1
      if (startHour < 0) {
        startHour = 23
        startDay = startDay - 1
        if (startDay < 1) {
          startDay = new Date(startYear, startMonth - 1, 0).getDate()
          startMonth = startMonth - 1
          if (startMonth < 1) {
            startMonth = 12
            startYear = startYear - 1
          }
        }
      }
      break
    case 2:
      startHour = startHour - 4
      if (startHour < 0) {
        startHour = startHour + 24
        startDay = startDay - 1
        if (startDay < 1) {
          startDay = new Date(startYear, startMonth - 1, 0).getDate()
          startMonth = startMonth - 1
          if (startMonth < 1) {
            startMonth = 12
            startYear = startYear - 1
          }
        }
      }
      break
    case 3:
      startHour = 0
      startMin = 0
      startSec = 0
      break
  }
  fetchData(`${config.apiBaseUrl}/device/pull-data`, {
    method: 'POST',
    body: {
      deviceName: deviceName.value,
      deviceAddress: deviceAddress.value,
      username: deviceLogin.value,
      password: devicePassword.value,
      updateStamp: deviceRefreshInterval.value,
      autoPull: true,
      startYear,
      startMonth,
      startDay,
      startHour,
      startMin,
      startSec,
    },
    status: addDeviceStatus,
    fetchedResponse: addDeviceResponse,
    requiresAuth: true,
  })
}

const errorTitle = computed(() => {
  if (addDeviceResponse.value?.title) {
    return addDeviceResponse.value.title
  }
  return 'Error'
})

const errorDetail = computed(() => {
  if (addDeviceResponse.value?.detail) {
    return addDeviceResponse.value.detail
  }
  return 'An error occurred while adding the device. Please try again later.'
})

// Watch for status changes and handle all effects
watch(
  () => addDeviceStatus.value,
  (newStatus) => {
    toast.removeGroup('br')

    if (newStatus === 'error') {
      toast.add({
        severity: 'error',
        summary: errorTitle.value,
        detail: errorDetail.value,
        group: 'br',
        closable: true,
        icon: 'pi pi-exclamation-circle',
      })
    }

    if (newStatus === 'loaded') {
      // Emit device-added event
      emit(
        'device-added',
        addDeviceResponse.value.data.deviceInfo.deviceSerial,
        addDeviceResponse.value.data.deviceInfo.name,
      )
      // Show success toast
      toast.add({
        severity: 'success',
        summary: 'Device added successfully',
        detail: `Device Name: ${addDeviceResponse.value.data.deviceInfo.name}`,
        group: 'br',
        life: 4000,
      })
    }
  },
)
</script>
<style scoped>
i {
  font-size: 0.875rem;
  color: var(--p-primary-color);
}

.section-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
  border: 1px solid var(--p-background-lvl3);
  border-radius: var(--p-border-radius-xs);
  .section-container-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--p-text-secondary-color);
    }
  }
  .section-container-body {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
    > * {
      flex: 1;
    }
  }
}

/* Styles pour que l'AutoComplete prenne toute la largeur disponible */
:deep(.p-autocomplete) {
  width: 100%;
}

:deep(.p-autocomplete .p-inputtext) {
  width: 100%;
}

:deep(.p-autocomplete-panel) {
  width: 100%;
  min-width: 100%;
}

/* Style spécifique pour l'AutoComplete de ce formulaire */
:deep(
  .device-address-autocomplete
    .p-autocomplete-list-container
    .p-autocomplete-list
    .p-autocomplete-option
) {
  font-size: 12px !important;
}

:deep(.device-address-autocomplete .p-autocomplete-list-container li) {
  font-size: 12px !important;
}
</style>
