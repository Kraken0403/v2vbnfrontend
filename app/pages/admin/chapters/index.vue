<script setup>
definePageMeta({
  middleware: ['auth', 'admin'],
})

const { $api } = useNuxtApp()
const chapters = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await $api.get('/chapters')
    chapters.value = data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <h1 class="text-xl font-semibold mb-4">Chapters</h1>

    <div v-if="loading" class="text-gray-500">Loading chapters…</div>

    <div v-else class="space-y-3">
      <NuxtLink
        v-for="chapter in chapters"
        :key="chapter.id"
        :to="`/admin/chapters/${chapter.id}`"
        class="block bg-white rounded-lg p-4 shadow hover:bg-gray-50"
      >
        <div class="font-medium">{{ chapter.name }}</div>
        <div class="text-sm text-gray-500">{{ chapter.city }}</div>
      </NuxtLink>
    </div>
  </div>
</template>
