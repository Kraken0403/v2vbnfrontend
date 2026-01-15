<script setup>
definePageMeta({
  middleware: ['auth', 'admin'],
})

const route = useRoute()
const { $api } = useNuxtApp()

const members = ref([])
const chapter = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const [chapterRes, membersRes] = await Promise.all([
      $api.get(`/chapters/${route.params.id}`),
      $api.get(`/members/chapter/${route.params.id}`),
    ])

    chapter.value = chapterRes.data
    members.value = membersRes.data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div v-if="loading" class="text-gray-500">Loading members…</div>

    <div v-else>
      <h1 class="text-xl font-semibold mb-4">
        {{ chapter?.name }} – Members
      </h1>

      <div class="space-y-3">
        <div
          v-for="m in members"
          :key="m.id"
          class="bg-white p-4 rounded-lg shadow"
        >
          <div class="font-medium">{{ m.full_name }}</div>
          <div class="text-sm text-gray-500">
            {{ m.company_name }} • {{ m.category }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
