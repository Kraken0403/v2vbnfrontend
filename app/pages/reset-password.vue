<script setup>
const route = useRoute()
const token = route.query.token

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const { $api } = useNuxtApp()
const { open } = useSnackbar()

if (!token) {
  open('Invalid reset link', 'error')
}

const submit = async () => {
  if (!password.value || password.value.length < 6) {
    open('Password must be at least 6 characters', 'error')
    return
  }

  if (password.value !== confirmPassword.value) {
    open('Passwords do not match', 'error')
    return
  }

  loading.value = true
  try {
    await $api.post('/auth/reset-password', {
      token,
      password: password.value,
    })

    open('Password reset successful. Please login.', 'success')

    setTimeout(() => {
      navigateTo('/')
    }, 1500)

  } catch (err) {
    open(
      err?.response?.data?.message ??
        'Reset link expired or invalid',
      'error',
    )
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
      <h1 class="text-2xl font-semibold text-center mb-6">
        Reset Password
      </h1>

      <form
        v-if="token"
        @submit.prevent="submit"
        class="space-y-4"
      >
        <div>
          <label class="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter new password"
            class="w-full border rounded-lg px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm password"
            class="w-full border rounded-lg px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg
                 font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>

      <div v-else class="text-center text-red-600">
        Invalid reset link
      </div>
    </div>
  </div>
</template>
