<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMeetings } from '@/composables/useMeetings'
import { useMemberProfile } from '@/composables/useMemberProfile'

import AttendanceTab from '@/components/attendance/AttendanceTab.vue'
import SeatingEditor from '@/components/meetings/SeatingEditor.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'member',
})

const route = useRoute()
const { open } = useSnackbar()

/* =======================
   PROFILE / ROLE
   ======================= */
const profileStore = useMemberProfile()
const member = computed(() => profileStore.profile ?? null)

const isLeadership = computed(() => {
  if (!member.value) return false
  if (!Array.isArray(member.value.roles)) return false

  return member.value.roles.some((r: any) =>
    ['PRESIDENT', 'VP', 'ST'].includes(r.role),
  )
})

/* =======================
   MEETING DATA
   ======================= */
const { getMyMeeting, closeMeeting } = useMeetings()

const meeting = ref<any | null>(null)
const loading = ref(true)
const activeTab = ref<'general' | 'attendance' | 'activities'>('general')

onMounted(async () => {
  try {
    meeting.value = await getMyMeeting(
      Number(route.params.id),
    )
  } catch (e) {
    console.error(e)
    meeting.value = null
  } finally {
    loading.value = false
  }
})

/* =======================
   ACTIONS
   ======================= */
const handleCloseMeeting = async () => {
  if (!meeting.value) return
  if (!confirm('Close this meeting? This cannot be undone.')) return

  try {
    await closeMeeting(meeting.value.id)
    meeting.value.status = 'CLOSED'
    open('Meeting closed', 'success')
  } catch (e) {
    console.error(e)
    open('Only leadership team can close meeting', 'error')
  }
}
</script>

<template>
  <div class="p-4">
    <!-- Loading -->
    <div v-if="loading" class="text-center text-gray-500">
      Loading meeting...
    </div>

    <!-- Content -->
    <div v-else-if="meeting" class="space-y-4">
      <!-- Header -->
      <div class="bg-white border rounded-lg p-4 space-y-2">
        <h1 class="text-lg font-semibold">
          {{ meeting.title }}
        </h1>

        <div class="text-sm text-gray-600">
          {{ new Date(meeting.meeting_at).toLocaleString() }}
        </div>

        <!-- STATUS -->
        <span
          class="inline-block text-xs px-2 py-1 rounded"
          :class="meeting.status === 'CLOSED'
            ? 'bg-red-100 text-red-700'
            : 'bg-green-100 text-green-700'"
        >
          {{ meeting.status }}
        </span>
      </div>

      <!-- Tabs -->
      <div class="flex border-b text-sm">
        <button
          class="flex-1 py-2 text-center"
          :class="activeTab === 'general'
            ? 'border-b-2 border-blue-600 font-medium'
            : 'text-gray-500'"
          @click="activeTab = 'general'"
        >
          General
        </button>

        <button
          class="flex-1 py-2 text-center"
          :class="activeTab === 'attendance'
            ? 'border-b-2 border-blue-600 font-medium'
            : 'text-gray-500'"
          @click="activeTab = 'attendance'"
        >
          Attendance
        </button>

        <button
          class="flex-1 py-2 text-center"
          :class="activeTab === 'activities'
            ? 'border-b-2 border-blue-600 font-medium'
            : 'text-gray-500'"
          @click="activeTab = 'activities'"
        >
          Activities
        </button>
      </div>

      <!-- GENERAL TAB -->
      <div
        v-if="activeTab === 'general'"
        class="bg-white border rounded-lg p-4 space-y-3"
      >
        <div>
          <span class="text-xs text-gray-500">Venue</span>
          <div class="text-sm">
            {{ meeting.venue || '—' }}
          </div>
        </div>

        <div v-if="meeting.map_link">
          <a
            :href="meeting.map_link"
            target="_blank"
            class="text-blue-600 text-sm underline"
          >
            Open Map
          </a>
        </div>

        <!-- Seating -->
        <SeatingEditor :meeting-id="meeting.id" />

        <!-- CLOSE -->
        <button
          v-if="isLeadership && meeting.status === 'OPEN'"
          @click="handleCloseMeeting"
          class="w-full mt-3 bg-red-600 text-white py-2 rounded"
        >
          Close Meeting
        </button>
      </div>

      <!-- ATTENDANCE TAB -->
      <div
        v-if="activeTab === 'attendance'"
        class="bg-white border rounded-lg p-4"
      >
        <AttendanceTab :meeting-id="meeting.id" />
      </div>

      <!-- ACTIVITIES TAB -->
      <div
        v-if="activeTab === 'activities'"
        class="bg-white border rounded-lg p-4 text-sm text-gray-600"
      >
        Activities (Referrals, F2F, Appreciation) will appear here.
      </div>
    </div>

    <!-- Not found -->
    <div v-else class="text-center text-red-500">
      Meeting not found
    </div>
  </div>
</template>
