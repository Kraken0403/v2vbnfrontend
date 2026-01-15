<script setup>
definePageMeta({
  middleware: ['auth', 'admin'],
})

const cards = [
  {
    title: 'Chapters',
    description: 'Manage chapters, members and meetings',
    to: '/admin/chapters',
  },
  {
    title: 'Members',
    description: 'Search and manage all members',
    to: '/admin/members', // optional, future-ready
  },
  {
    title: 'Meetings',
    description: 'View meetings across chapters',
    to: '/admin/meetings', // optional, future-ready
  },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">Admin Dashboard</h1>
      <p class="text-sm text-gray-600">
        V2VBN Administration Panel
      </p>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 gap-4">
      <NuxtLink
        v-for="card in cards"
        :key="card.title"
        :to="card.to"
        class="block bg-white rounded-xl p-5 shadow
               hover:bg-gray-50 transition"
      >
        <div class="text-lg font-medium">
          {{ card.title }}
        </div>
        <div class="text-sm text-gray-500 mt-1">
          {{ card.description }}
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
