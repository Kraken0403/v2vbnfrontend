<script setup>
definePageMeta({
  middleware: ['auth', 'admin'],
})

const route = useRoute()
const { $api } = useNuxtApp()

const loading = ref(true)
const meetings = ref([])

onMounted(async () => {
  try {
    const { data } = await $api.get(
      `/meetings/chapter/${route.params.id}`,
    )
    meetings.value = data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-lg font-semibold">Meetings</h1>

      <NuxtLink
        :to="`/admin/chapters/${route.params.id}/meetings/create`"
        class="bg-blue-600 text-white px-4 py-2 rounded text-sm"
      >
        + Create
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-gray-500 text-center">
      Loading meetings...
    </div>

    <div v-else-if="meetings.length === 0" class="text-gray-500 text-center">
      No meetings found
    </div>

    <div class="space-y-3">
      <NuxtLink
        v-for="m in meetings"
        :key="m.id"
        :to="`/admin/chapters/${route.params.id}/meetings/${m.id}`"
        class="block bg-white rounded-lg border p-4"
      >
        <div class="font-medium">{{ m.title }}</div>
        <div class="text-sm text-gray-500">
          {{ new Date(m.meeting_at).toLocaleString() }}
        </div>
        <div
          class="text-xs mt-1 inline-block px-2 py-0.5 rounded"
          :class="m.status === 'CLOSED'
            ? 'bg-red-100 text-red-700'
            : 'bg-green-100 text-green-700'"
        >
          {{ m.status }}
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
