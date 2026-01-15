<script setup>
import NotificationSnackbar from '@/components/ui/NotificationSnackbar.vue'
import { useAuth } from '@/composables/useAuth'

const { init } = useAuth()

onMounted(() => {
  init()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <!-- Global UI -->
  <NotificationSnackbar />
</template>
