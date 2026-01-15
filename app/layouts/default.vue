<script setup lang="ts">
import NotificationSnackbar from '@/components/ui/NotificationSnackbar.vue'
import { onMounted } from 'vue'

const { init } = useAuth()

onMounted(() => {
  init()
})
</script>

<template>
    <div class="min-h-screen bg-gray-100">
      <slot />
    </div>
  </template>
  
