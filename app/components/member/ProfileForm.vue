<script setup>
const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
})

const { $api } = useNuxtApp()
const { open } = useSnackbar()

const form = reactive({
  full_name: props.member.full_name,
  company_name: props.member.company_name,
  designation: props.member.designation,
  category: props.member.category,
  phone: props.member.phone,
  email: props.member.email,
})

const saving = ref(false)

const save = async () => {
  saving.value = true
  try {
    await $api.patch('/members/me', form)
    open('Profile updated', 'success')
  } catch {
    open('Failed to update profile', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow space-y-4">
    <input v-model="form.full_name" class="input" placeholder="Full name" />
    <input v-model="form.company_name" class="input" placeholder="Company" />
    <input v-model="form.designation" class="input" placeholder="Designation" />
    <input v-model="form.category" class="input" placeholder="Category" />
    <input v-model="form.phone" class="input" placeholder="Phone" />
    <input v-model="form.email" class="input" placeholder="Email" />

    <button
      @click="save"
      :disabled="saving"
      class="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      {{ saving ? 'Saving...' : 'Save Profile' }}
    </button>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
}
</style>
