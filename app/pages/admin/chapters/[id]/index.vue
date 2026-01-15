<script setup>
definePageMeta({
  middleware: ['auth', 'admin'],
})

const route = useRoute()
const { $api } = useNuxtApp()

const chapter = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await $api.get(`/chapters/${route.params.id}`)
    chapter.value = data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div v-if="loading" class="text-gray-500">Loading chapter…</div>

    <div v-else-if="chapter">
      <h1 class="text-xl font-semibold mb-2">{{ chapter.name }}</h1>
      <p class="text-gray-600 mb-6">{{ chapter.city }}</p>

      <div class="space-y-3">
        <NuxtLink
          :to="`/admin/chapters/${chapter.id}/members`"
          class="block bg-white p-4 rounded-lg shadow"
        >
          Manage Members
        </NuxtLink>

        <NuxtLink
          :to="`/admin/chapters/${chapter.id}/meetings`"
          class="block bg-white p-4 rounded-lg shadow"
        >
          Meetings & Activities
        </NuxtLink>
      </div>
    </div>

    <div v-else class="text-red-500">Chapter not found</div>
  </div>
</template>
