<template>
  <Form @submit="handleSubmit" class="form-group">
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
  </Form>
</template>

<script setup>
import { ref, computed } from 'vue'
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
} from '@phosphor-icons/vue'
import fetchData from '@/utils/fetcherAPI'
import { config } from '@/utils/config'

const deviceName = ref('')
const deviceAddress = ref('')
const deviceLogin = ref('')
const devicePassword = ref('')
const addDeviceStatus = ref(null)
const addDeviceResponse = ref(null)

const isButtonLoading = computed(() => {
  return addDeviceStatus.value === 'loading'
})

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

const handleSubmit = () => {
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
    data: addDeviceResponse,
    requiresAuth: true,
  })
  console.log('submit')
}
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
</style>
