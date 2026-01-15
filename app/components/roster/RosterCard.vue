<script setup>
import { computed } from 'vue'

const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
  roles: {
    type: Array,
    default: () => [],
  },
})

const config = useRuntimeConfig()

/* ============================
   PHOTO URL (BACKEND SAFE)
============================ */
const photoUrl = computed(() => {
  if (!props.member.profile?.photo_url) return null
  return `${config.public.apiBase}${props.member.profile.photo_url}`
})

/* ============================
   INITIALS
============================ */
const initials = computed(() => {
  if (!props.member.full_name) return '?'

  const parts = props.member.full_name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0][0].toUpperCase()
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase()
})

/* ============================
   ROLE STYLES (OPTIONAL USE)
============================ */
function roleClass(role) {
  switch (role) {
    case 'PRESIDENT':
    case 'VP':
    case 'ST':
      return 'bg-blue-600 text-white'
    case 'MENTOR':
      return 'bg-indigo-600 text-white'
    case 'CORE':
      return 'bg-gray-600 text-white'
    case 'ATTENDANCE_COORDINATOR':
      return 'bg-cyan-600 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm p-4 flex gap-4
           border border-gray-100 overflow-hidden"
  >
    <!-- Avatar -->
    <div class="shrink-0">
      <!-- Image -->
      <img
        v-if="photoUrl"
        :src="photoUrl"
        alt="Member photo"
        class="w-[100px] h-[150px] rounded-[8px] object-cover"
      />

      <!-- Initials -->
      <div
        v-else
        class="w-[100px] h-[150px] rounded-[8px]
               bg-gradient-to-br from-blue-700 to-teal-500
               flex items-center justify-center
               text-white font-semibold text-sm"
      >
        {{ initials }}
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <!-- Name + Roles -->
      <div class="flex flex-col items-start justify-between gap-0">
        <h3 class="font-[15px] capitalize text-gray-900">
          {{ member.full_name }}
        </h3>

        <!-- Role badges -->
        <div class="flex my-1 flex-wrap justify-end">
          <span
            v-for="r in roles"
            :key="r.role"
            class="text-[10px] px-2 py-0.5 rounded-full
                   bg-blue-500 text-white whitespace-nowrap"
          >
            {{ r.role.replace(/_/g, ' ') }}
          </span>
        </div>
      </div>

      <!-- Company -->
      <p
        v-if="member.company_name"
        class="text-sm text-gray-600 font-semibold mt-0.5 truncate"
      >
        {{ member.company_name }}
      </p>

      <!-- Category -->
      <p
        v-if="member.category"
        class="text-xs text-gray-500 mt-1"
      >
        <span class="font-semibold text-gray-600">
          Category:
        </span>
        {{ member.category }}
      </p>

      <!-- Email -->
      <p
        v-if="member.email"
        class="text-xs text-blue-700 mt-1 break-all"
      >
        {{ member.email }}
      </p>
    </div>
  </div>
</template>
