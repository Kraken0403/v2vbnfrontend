<script setup>
definePageMeta({
  layout: 'member',
  middleware: ['auth'],
})

const { $api } = useNuxtApp()
const loading = ref(true)
const activities = ref([])

onMounted(async () => {
  try {
    const { data } = await $api.get('/activities/my')
    activities.value = data
  } finally {
    loading.value = false
  }
})
</script>


<template>
  <div>
    <h1 class="text-xl font-semibold mb-4">
      My Activities
    </h1>

    <div v-if="loading" class="text-gray-500">
      Loading activities...
    </div>

    <div v-else-if="activities.length" class="space-y-3">
      <div
        v-for="a in activities"
        :key="a.id"
        class="bg-white rounded-xl p-4 border"
      >
        <div class="text-sm font-medium">
          {{ a.type }}
        </div>

        <div class="text-xs text-gray-600">
          {{ new Date(a.created_at).toLocaleString() }}
        </div>

        <div v-if="a.note" class="text-sm mt-1">
          {{ a.note }}
        </div>
      </div>
    </div>

    <div v-else class="text-gray-500">
      No activities yet.
    </div>
  </div>
</template>
