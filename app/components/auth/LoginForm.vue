<script setup>
import ForgotPasswordModal from './ForgotPasswordModal.vue'

const email = ref('')
const password = ref('')
const loading = ref(false)
const showForgot = ref(false)

const { $api } = useNuxtApp()
const { setAuth, loadUser, user } = useAuth()
const { open } = useSnackbar()

const submit = async () => {
  loading.value = true

  try {
    // 1️⃣ Login
    const { data } = await $api.post('/auth/login', {
      email: email.value,
      password: password.value,
    })

    // 2️⃣ Save token ONLY
    setAuth(data.access_token)

    // 3️⃣ Fetch fresh user from backend
    await loadUser()

    open('Login successful', 'success')

    // 4️⃣ Redirect based on role
    if (user.value?.role === 'MEMBER') {
      await navigateTo('/member/profile')
    } else {
      await navigateTo('/dashboard')
    }

  } catch (err) {
    open(
      err?.response?.data?.message ??
        'Invalid email or password',
      'error',
    )
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-8">
    <h1 class="text-2xl font-semibold text-center mb-6">
      V2VBN Login
    </h1>

    <form @submit.prevent="submit" class="space-y-4">
      <!-- Email -->
      <div>
        <label class="block text-sm font-medium mb-1">
          Email Address
        </label>
        <input
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="Enter your email"
          class="w-full border rounded-lg px-3 py-2
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="Enter password"
          class="w-full border rounded-lg px-3 py-2
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <!-- Forgot password -->
      <div class="text-right">
        <button
          type="button"
          @click="showForgot = true"
          class="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-2 rounded-lg
               font-medium hover:bg-blue-700 disabled:opacity-60"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <!-- Forgot password modal -->
    <ForgotPasswordModal
      :open="showForgot"
      @close="showForgot = false"
    />
  </div>
</template>
