<script setup>
const { user, logout } = useAuth()
</script>

<template>
  <header class="h-14 bg-white border-b flex items-center justify-between px-6">
    <div class="text-sm text-gray-600">
      {{ user?.member?.full_name }}
    </div>

    <button
      @click="logout"
      class="text-sm text-red-600 hover:underline"
    >
      Logout
    </button>
  </header>
</template>
