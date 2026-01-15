<script setup>
definePageMeta({
  middleware: ['auth', 'admin'],
})

const route = useRoute()
const { $api } = useNuxtApp()
const { open } = useSnackbar()

const loading = ref(false)

const form = reactive({
  title: '',
  meeting_at: '',
  venue: '',
  map_link: '',
})

const submit = async () => {
  loading.value = true
  try {
    await $api.post('/meetings', {
      chapter_id: Number(route.params.id),
      ...form,
    })

    open('Meeting created', 'success')
    navigateTo(`/admin/chapters/${route.params.id}/meetings`)
  } catch {
    open('Failed to create meeting', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-lg font-semibold mb-4">Create Meeting</h1>

    <form @submit.prevent="submit" class="space-y-4">
      <input
        v-model="form.title"
        placeholder="Meeting title"
        required
        class="w-full border p-2 rounded"
      />

      <input
        type="datetime-local"
        v-model="form.meeting_at"
        required
        class="w-full border p-2 rounded"
      />

      <input
        v-model="form.venue"
        placeholder="Venue"
        class="w-full border p-2 rounded"
      />

      <input
        v-model="form.map_link"
        placeholder="Google Map link"
        class="w-full border p-2 rounded"
      />

      <button
        class="w-full bg-blue-600 text-white py-2 rounded"
        :disabled="loading"
      >
        {{ loading ? 'Creating...' : 'Create Meeting' }}
      </button>
    </form>
  </div>
</template>
