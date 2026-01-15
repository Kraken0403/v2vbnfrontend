<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { user } = useAuth()

/**
 * Leadership = PRESIDENT / VP / ST
 * ONLY within user's chapter
 */
const isLeadership = computed(() => {
  if (!user.value?.member?.chapters) return false

  return user.value.member.chapters.some((mc: any) =>
    Array.isArray(mc.roles) &&
    mc.roles.some((r: any) =>
      ['PRESIDENT', 'VP', 'ST'].includes(r.role),
    ),
  )
})
</script>

<template>
  <aside class="w-64 bg-white border-r min-h-screen p-4">
    <h2 class="text-lg font-semibold mb-6">
      Member Panel
    </h2>

    <nav class="space-y-2 text-sm">
      <!-- Profile -->
      <NuxtLink
        to="/member/profile"
        class="block px-3 py-2 rounded-lg"
        :class="route.path.startsWith('/member/profile')
          ? 'bg-blue-100 text-blue-700'
          : 'hover:bg-gray-100'"
      >
        👤 Profile
      </NuxtLink>

      <!-- Meetings (CHAPTER leadership only) -->
      <NuxtLink
        v-if="isLeadership"
        to="/member/meetings"
        class="block px-3 py-2 rounded-lg"
        :class="route.path.startsWith('/member/meetings')
          ? 'bg-blue-100 text-blue-700'
          : 'hover:bg-gray-100'"
      >
        🗓️ Meetings
      </NuxtLink>

      <!-- My Activities -->
      <NuxtLink
        to="/member/activities"
        class="block px-3 py-2 rounded-lg"
        :class="route.path.startsWith('/member/activities')
          ? 'bg-blue-100 text-blue-700'
          : 'hover:bg-gray-100'"
      >
        📊 My Activities
      </NuxtLink>
    </nav>
  </aside>
</template>
