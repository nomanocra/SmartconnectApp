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
      <div class="form-actions-left">
        <Button
          type="button"
          :label="$t('common.delete')"
          icon="pi pi-trash"
          severity="danger"
          outlined
          @click="handleDeleteDevice"
          :disabled="isButtonLoading"
        />
      </div>
      <div class="form-actions-right">
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
          :disabled="!hasChanges"
        />
      </div>
    </div>
  </Form>

  <!-- Delete Device Confirmation Dialog -->
  <Dialog
    v-model:visible="deleteDeviceDialogVisible"
    modal
    :header="$t('deleteDevice.title')"
    :style="{ width: '32rem' }"
    :draggable="false"
  >
    <ConfirmDeviceDeleteForm
      :deviceName="newDeviceName"
      :deviceAddress="newDeviceAddress"
      @device-deleted="handleDeviceDeleted"
      @close-delete-dialog="handleCloseDeleteDialog"
    />
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import InputText from 'primevue/inputtext'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import Dialog from 'primevue/dialog'
import LabeledInput from '@/components/base/LabeledInput.vue'
import ConfirmDeviceDeleteForm from '@/components/features/ConfirmDeviceDeleteForm.vue'

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

const emit = defineEmits(['device-edited', 'close-edit-device', 'device-deleted'])

const isButtonLoading = computed(() => {
  return editDeviceStatus.value === 'loading'
})

// Computed property to check if any changes have been made
const hasChanges = computed(() => {
  const nameChanged = newDeviceName.value !== props.deviceName
  const refreshIntervalChanged = deviceRefreshInterval.value !== null
  return nameChanged || refreshIntervalChanged
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

// Delete device dialog state
const deleteDeviceDialogVisible = ref(false)

const handleDeleteDevice = () => {
  deleteDeviceDialogVisible.value = true
}

const handleCloseDeleteDialog = () => {
  deleteDeviceDialogVisible.value = false
}

const handleDeviceDeleted = (deviceAddress) => {
  deleteDeviceDialogVisible.value = false
  emit('device-deleted', deviceAddress)
}

const handleCancel = () => {
  emit('close-edit-device')
}

const handleEditDevice = () => {
  const requestBody = {
    deviceName: newDeviceName.value,
    deviceAddress: newDeviceAddress.value,
  }

  if (deviceRefreshInterval.value !== null) {
    requestBody.updateStamp = deviceRefreshInterval.value
  }

  fetchData(`${config.apiBaseUrl}/devices/update`, {
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
    if (newStatus === 'error') {
      toast.removeGroup('br')
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
      const deviceName = editDeviceResponse.value?.data?.deviceInfo?.name || newDeviceName.value
      toast.add({
        severity: 'success',
        summary: 'Device updated successfully',
        detail: `Device Name: ${deviceName}`,
        group: 'br',
        life: 4000,
      })
    }
  },
)

watch(editDeviceStatus, (newStatus) => {
  if (newStatus === 'loaded') {
    emit('device-edited', newDeviceName.value)
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
  flex: 1;
  gap: 0.5rem;
  justify-content: space-between;
  margin-top: 1rem;
}

.form-actions-left {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-start;
}

.form-actions-right {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
