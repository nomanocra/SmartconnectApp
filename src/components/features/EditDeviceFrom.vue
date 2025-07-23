<template>
  <Form @submit="handleEditDevice" class="form-group">
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
          <InputText v-model="newDeviceName" type="text" placeholder="Building Floor1" />
        </LabeledInput>
        <LabeledInput :label="$t('addDevice.deviceAddress')" id="deviceAddress">
          <template #icon>
            <PhGlobeSimple :size="14" color="var(--p-primary-color)" />
          </template>
          <InputText v-model="newDeviceAddress" type="text" placeholder="192.168.1.100" disabled />
        </LabeledInput>
      </div>
    </div>
    <div class="section-container">
      <div class="section-container-header">
        <PhUpload :size="16" color="var(--p-primary-color)" />
        <label>{{ $t('addDevice.deviceDataLoadingSettings') }}</label>
      </div>
      <div class="section-container-body">
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
    <div class="form-actions">
      <Button
        type="button"
        :label="$t('common.cancel')"
        text
        severity="secondary"
        @click="handleCancel"
        :disabled="isButtonLoading"
      />
      <Button
        type="submit"
        :label="
          isButtonLoading
            ? $t('pages.dashboard.editDevice') + '...'
            : $t('pages.dashboard.editDevice')
        "
        icon="pi pi-pencil"
        :loading="isButtonLoading"
        :disabled="!deviceName || !deviceAddress"
      />
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
  PhInfo,
  PhArrowsCounterClockwise,
  PhGlobeSimple,
  PhHardDrive,
} from '@phosphor-icons/vue'
import fetchData from '@/utils/fetcherAPI'
import { config } from '@/utils/config'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

// Props pour recevoir les données du device à éditer
const props = defineProps({
  deviceName: {
    type: String,
    required: true,
  },
  deviceAddress: {
    type: String,
    required: true,
  },
})

const newDeviceName = ref(props.deviceName)
const newDeviceAddress = ref(props.deviceAddress)

const editDeviceStatus = ref(null)
const editDeviceResponse = ref(null)

const emit = defineEmits(['device-edited', 'cancel'])

const isButtonLoading = computed(() => {
  return editDeviceStatus.value === 'loading'
})

const toast = useToast()
const { t } = useI18n()

const deviceRefreshIntervalOptions = ref([
  { label: t('addDevice.fiveMinutes'), value: 5 },
  { label: t('addDevice.tenMinutes'), value: 10 },
  { label: t('addDevice.twentyMinutes'), value: 20 },
  { label: t('addDevice.oneHour'), value: 60 },
])
const deviceRefreshInterval = ref(null)

const handleCancel = () => {
  emit('cancel')
}

const handleEditDevice = () => {
  editDeviceStatus.value = 'loading'

  const requestBody = {
    deviceName: newDeviceName.value,
    deviceAddress: newDeviceAddress.value,
    requiresAuth: true,
  }

  if (deviceRefreshInterval.value !== null) {
    requestBody.updateStamp = deviceRefreshInterval.value
  }

  fetchData(`${config.apiBaseUrl}/device/update`, {
    method: 'PUT',
    body: requestBody,
    status: editDeviceStatus,
    fetchedResponse: editDeviceResponse,
    requiresAuth: true,
  })
}

const errorTitle = computed(() => {
  if (editDeviceResponse.value?.title) {
    return editDeviceResponse.value.title
  }
  return 'Error'
})

const errorDetail = computed(() => {
  if (editDeviceResponse.value?.detail) {
    return editDeviceResponse.value.detail
  }
  return 'An error occurred while updating the device. Please try again later.'
})

// Watch for error status and display toast
watch(
  () => editDeviceStatus.value,
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
        summary: 'Device updated successfully',
        detail: `Device Name: ${editDeviceResponse.value.data.deviceInfo.name}`,
        group: 'br',
        life: 4000,
      })
    }
  },
)

watch(editDeviceStatus, (newStatus) => {
  if (newStatus === 'loaded') {
    emit(
      'device-edited',
      editDeviceResponse.value.data.deviceInfo.deviceSerial,
      editDeviceResponse.value.data.deviceInfo.name,
    )
  }
})
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

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>
