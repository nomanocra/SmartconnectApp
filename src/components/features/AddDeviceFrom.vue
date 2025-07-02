<template>
  <Form @submit="handleAddDevice" class="form-group">
    <div class="section-container">
      <div class="section-container-header">
        <PhInfo :size="16" color="var(--p-primary-color)" />
        <label>Device information</label>
      </div>
      <div class="section-container-body">
        <LabeledInput label="Name" id="deviceName">
          <template #icon>
            <PhHardDrive :size="14" color="var(--p-primary-color)" />
          </template>
          <InputText v-model="deviceName" type="text" placeholder="Building Floor1" />
        </LabeledInput>
        <LabeledInput label="Address" id="deviceAddress">
          <template #icon>
            <PhGlobeSimple :size="14" color="var(--p-primary-color)" />
          </template>
          <InputText v-model="deviceAddress" type="text" placeholder="192.168.1.100" />
        </LabeledInput>
      </div>
    </div>
    <div class="section-container">
      <div class="section-container-header">
        <PhShieldCheck :size="16" color="var(--p-primary-color)" />
        <label>Device authentication</label>
      </div>
      <div class="section-container-body">
        <LabeledInput label="Login" id="deviceLogin">
          <template #icon>
            <PhUser :size="14" color="var(--p-primary-color)" />
          </template>
          <InputText v-model="deviceLogin" type="text" placeholder="Admin" />
        </LabeledInput>
        <LabeledInput label="Password" id="devicePassword">
          <template #icon>
            <PhLock :size="14" color="var(--p-primary-color)" />
          </template>
          <InputText v-model="devicePassword" type="password" placeholder="••••••••" />
        </LabeledInput>
      </div>
    </div>
    <div class="section-container">
      <div class="section-container-header">
        <PhUpload :size="16" color="var(--p-primary-color)" />
        <label>Data Loading Settings</label>
      </div>
      <div class="section-container-body">
        <LabeledInput label="Initial Data History" id="deviceInitialHistory">
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
        <LabeledInput label="Refresh interval" id="devicePullInterval">
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
      label="Add device"
      icon="pi pi-plus"
      :loading="isButtonLoading"
      :disabled="!deviceName || !deviceAddress || !deviceLogin || !devicePassword"
    />

    <!-- TO BE REMOVED LATER -->

    <!-- Success display -->
    <div v-if="isSuccess" class="success-container">
      <div class="success-header">
        <PhCheckCircle :size="16" color="var(--p-success-color)" />
        <span class="success-title">Device added successfully</span>
      </div>
      <p v-if="addDeviceResponse">Device ID: {{ addDeviceResponse.deviceId || 'N/A' }}</p>
    </div>
  </Form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import InputText from 'primevue/inputtext'
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
  PhCheckCircle,
} from '@phosphor-icons/vue'
import fetchData from '@/utils/fetcherAPI'
import { config } from '@/utils/config'
import { useToast } from 'primevue/usetoast'

const deviceName = ref('')
const deviceAddress = ref('')
const deviceLogin = ref('')
const devicePassword = ref('')
const addDeviceStatus = ref(null)
const addDeviceResponse = ref(null)

const emit = defineEmits(['device-added'])

const isButtonLoading = computed(() => {
  return addDeviceStatus.value === 'loading'
})

const toast = useToast()

const deviceRefreshIntervalOptions = ref([
  { label: '5min', value: 5 },
  { label: '10min', value: 10 },
  { label: '20min', value: 20 },
  { label: '1h', value: 60 },
])
const deviceRefreshInterval = ref(10)

const deviceInitialHistoryOptions = ref([
  { label: 'None', value: 0 },
  { label: '1h', value: 1 },
  { label: '4h', value: 2 },
  { label: 'Today', value: 3 },
])

const deviceInitialHistory = ref(1)

const handleAddDevice = () => {
  addDeviceStatus.value = 'loading'
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
      requiresAuth: true,
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

// Watch for error status and display toast
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

// TO BE REMOVED FROM HERE...

const isSuccess = computed(() => {
  if (addDeviceStatus.value === 'loaded') {
    emit('device-added', addDeviceResponse.value.data.device_id)
    return true
  }
  return false
})

//... TO HERE
</script>
<style scoped>
i {
  font-size: 0.875rem;
  color: var(--p-primary-color);
}

.section-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
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

/* --------------------------- */
/* To be removed in production */
.error-container {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid var(--p-error-color);
  border-radius: var(--p-border-radius-xs);
  background-color: var(--p-background-lvl1);

  .error-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    .error-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--p-error-color);
    }
  }

  .error-detail {
    font-size: 0.875rem;
    color: var(--p-error-color);
  }

  .error-info {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--p-error-color);
  }
}

.success-container {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid var(--p-success-color);
  border-radius: var(--p-border-radius-xs);
  background-color: var(--p-background-lvl1);

  .success-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    .success-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--p-success-color);
    }
  }

  .success-detail {
    font-size: 0.875rem;
    color: var(--p-success-color);
  }
}

.debug-info {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid var(--p-background-lvl3);
  border-radius: var(--p-border-radius-xs);
  background-color: var(--p-background-lvl1);

  span {
    font-size: 0.875rem;
    color: var(--p-text-secondary-color);
  }

  pre {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--p-text-secondary-color);
  }
}
</style>
