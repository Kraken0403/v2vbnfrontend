<script setup lang="ts">
definePageMeta({
  layout: 'member',
  middleware: ['auth'],
})

const { user } = useAuth()

const member = computed(() => user.value?.member || {})

const {
  profile,
  contact,
  load,
} = useMemberProfile()

onMounted(() => {
  if (member.id) {
    load(member.id)
  }
})
</script>

<template>
  <div class="max-w-4xl space-y-6">
    <h1 class="text-xl font-semibold">My Profile</h1>

    <!-- BASIC INFO -->
    <div class="bg-white rounded-xl p-6 shadow">
      <h2 class="font-medium mb-4">Basic Information</h2>

      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-gray-500">Full Name</p>
          <p class="font-medium">{{ member.full_name || '—' }}</p>
        </div>

        <div>
          <p class="text-gray-500">Email</p>
          <p class="font-medium">{{ user?.email || '—' }}</p>
        </div>

        <div>
          <p class="text-gray-500">Company</p>
          <p class="font-medium">{{ member.company_name || '—' }}</p>
        </div>

        <div>
          <p class="text-gray-500">Designation</p>
          <p class="font-medium">{{ member.designation || '—' }}</p>
        </div>

        <div>
          <p class="text-gray-500">Category</p>
          <p class="font-medium">{{ member.category || '—' }}</p>
        </div>

        <div>
          <p class="text-gray-500">Industry</p>
          <p class="font-medium">{{ member.industry || '—' }}</p>
        </div>
      </div>
    </div>

    <!-- PROFILE -->
    <div class="bg-white rounded-xl p-6 shadow">
      <h2 class="font-medium mb-4">Profile</h2>

      <p class="text-sm">
        <b>Headline:</b> {{ profile.headline || '—' }}
      </p>

      <p class="text-sm mt-2">
        <b>About:</b><br />
        {{ profile.about || '—' }}
      </p>
    </div>

    <!-- CONTACT -->
    <div class="bg-white rounded-xl p-6 shadow">
      <h2 class="font-medium mb-4">Contact</h2>

      <p class="text-sm">
        <b>Office Email:</b> {{ contact.office_email || '—' }}
      </p>

      <p class="text-sm">
        <b>Company Phone:</b> {{ contact.company_phone || '—' }}
      </p>
    </div>
  </div>
</template>
