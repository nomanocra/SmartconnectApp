<template>
  <div class="user-profile">
    <Avatar label="D" class="user-avatar" />
    <ProfileEditableInfos label="Full Name" :value="userInfos.fullName" editable />
    <ProfileEditableInfos label="Email" :value="userInfos.email" />
    <ProfileEditableInfos label="Role" :value="userInfos.role" />
    <ProfileEditableInfos label="Organization" :value="userInfos.organisationName" />
    <Button
      icon="pi pi-sign-out"
      iconPos="right"
      label="Sign out"
      class="button-primary"
      variant="text"
    ></Button>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import Avatar from 'primevue/avatar'
import ProfileEditableInfos from '@/components/base/ProfileEditableInfos.vue'
import Button from 'primevue/button'
const userInfos = inject('userInfos')
</script>

<style scoped>
.user-profile {
  display: flex;
  flex-direction: column;
  gap: 1.375rem;
}

.user-avatar {
  width: 8rem;
  height: 8rem;
  font-size: 3.5rem;
}
</style>
