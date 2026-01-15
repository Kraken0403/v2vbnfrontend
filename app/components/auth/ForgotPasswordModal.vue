<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])

const email = ref('')
const loading = ref(false)

const { $api } = useNuxtApp()
const { open: openSnackbar } = useSnackbar()

const submit = async () => {
  if (!email.value) return

  loading.value = true

  try {
    await $api.post('/auth/forgot-password', {
      email: email.value,
    })

    // Backend always returns generic success (security best practice)
    openSnackbar(
      'If this email exists, a reset link has been sent.',
      'success',
    )

    email.value = ''
    emit('close')
  } catch (err) {
    openSnackbar(
      err?.response?.data?.message ??
        'Unable to send reset link',
      'error',
    )
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">
          Forgot Password
        </h2>

        <button
          @click="emit('close')"
          class="text-gray-500 hover:text-black text-xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- Info -->
      <p class="text-sm text-gray-600 mb-4">
        Enter your registered email address. We’ll send you a password reset link.
      </p>

      <!-- Form -->
      <form @submit.prevent="submit" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          autocomplete="email"
          class="w-full border rounded-lg px-3 py-2
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg
                 font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>
    </div>
  </div>
</template>
