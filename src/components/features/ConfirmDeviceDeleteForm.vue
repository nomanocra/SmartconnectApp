<template>
  <Form @submit="handleConfirmDelete" class="form-group">
    <p class="delete-device-description">{{ $t('deleteDevice.description') }}</p>

    <LabeledInput :label="$t('deleteDevice.confirmationLabel')" id="deleteConfirmation">
      <template #icon>
        <PhWarning :size="14" color="var(--p-button-warn-background)" />
      </template>
      <InputText
        v-model="deleteConfirmationText"
        type="text"
        :placeholder="$t('deleteDevice.confirmationPlaceholder')"
        @input="handleDeleteConfirmationInput"
      />
    </LabeledInput>
    <div class="form-actions-right">
      <Button
        type="button"
        :label="$t('common.cancel')"
        text
        severity="secondary"
        @click="handleCancelDelete"
        :disabled="isDeleteButtonLoading"
      />
      <Button
        type="submit"
        :label="$t('common.confirmDelete')"
        icon="pi pi-trash"
        severity="danger"
        :loading="isDeleteButtonLoading"
        :disabled="!isDeleteConfirmationValid"
      />
    </div>
  </Form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import LabeledInput from '@/components/base/LabeledInput.vue'
import { PhWarning } from '@phosphor-icons/vue'
import { useI18n } from 'vue-i18n'
import fetchData from '@/utils/fetcherAPI'
import { config } from '@/utils/config'
import { useToast } from 'primevue/usetoast'

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

const emit = defineEmits(['device-deleted', 'close-delete-dialog'])

const { t } = useI18n()
const toast = useToast()

const deleteConfirmationText = ref('')
const deleteDeviceStatus = ref(null)
const deleteDeviceResponse = ref(null)

const isDeleteButtonLoading = computed(() => {
  return deleteDeviceStatus.value === 'loading'
})

const isDeleteConfirmationValid = computed(() => {
  return deleteConfirmationText.value === t('deleteDevice.confirmationText')
})

const handleCancelDelete = () => {
  deleteConfirmationText.value = ''
  emit('close-delete-dialog')
}

const handleDeleteConfirmationInput = () => {
  // This function is called when the input changes
  // The validation is handled by the computed property isDeleteConfirmationValid
}

const handleConfirmDelete = () => {
  const requestBody = {
    deviceAddress: props.deviceAddress,
  }

  fetchData(`${config.apiBaseUrl}/devices/delete`, {
    method: 'DELETE',
    body: requestBody,
    status: deleteDeviceStatus,
    fetchedResponse: deleteDeviceResponse,
    requiresAuth: true,
  })
}

// Watch for delete device status changes
watch(
  () => deleteDeviceStatus.value,
  (newStatus) => {
    if (newStatus === 'error') {
      toast.removeGroup('br')
      toast.add({
        severity: 'error',
        summary: 'Error deleting device',
        detail:
          deleteDeviceResponse.value?.detail ||
          'An error occurred while deleting the device. Please try again later.',
        group: 'br',
        closable: true,
        icon: 'pi pi-exclamation-circle',
      })
    }

    if (newStatus === 'loaded') {
      const deviceName = deleteDeviceResponse.value?.data?.deviceInfo?.name || props.deviceName
      toast.add({
        severity: 'success',
        summary: 'Device deleted successfully',
        detail: `Device Name: ${deviceName}`,
        group: 'br',
        life: 4000,
      })

      // Close dialog and emit event
      deleteConfirmationText.value = ''
      emit('device-deleted', props.deviceAddress)
    }
  },
)
</script>

<style scoped>
.delete-device-description {
  color: var(--p-text-secondary-color);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.form-actions-right {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
