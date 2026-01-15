<script setup>
import AttendanceTab from '@/components/attendance/AttendanceTab.vue'
import SeatingEditor from '@/components/meetings/SeatingEditor.vue'
definePageMeta({
  middleware: ['auth', 'admin'],
})

const route = useRoute()
const { $api } = useNuxtApp()
const { open } = useSnackbar()

const meeting = ref(null)
const loading = ref(true)
const activeTab = ref('general') // general | attendance | activities

onMounted(async () => {
  try {
    const { data } = await $api.get(
      `/meetings/${route.params.meetingId}`,
    )
    meeting.value = data
  } finally {
    loading.value = false
  }
})

const closeMeeting = async () => {
  try {
    await $api.post(`/meetings/${meeting.value.id}/close`)
    meeting.value.status = 'CLOSED'
    open('Meeting closed', 'success')
  } catch {
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

      <!-- TAB CONTENTS -->

      <!-- General Tab -->
      <div v-if="activeTab === 'general'" class="bg-white border rounded-lg p-4 space-y-2">
        <div>
          <span class="text-xs text-gray-500">Venue</span>
          <div class="text-sm">{{ meeting.venue || '—' }}</div>
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

        <SeatingEditor :meeting-id="meeting.id" />



        <button
          v-if="meeting.status === 'OPEN'"
          @click="closeMeeting"
          class="w-full mt-3 bg-red-600 text-white py-2 rounded"
        >
          Close Meeting
        </button>
      </div>

      <!-- Attendance Tab -->
      <div
        v-if="activeTab === 'attendance'"
        class="bg-white border rounded-lg p-4 text-sm text-gray-600"
      >
        <!-- Placeholder for now -->
        <AttendanceTab
        v-if="activeTab === 'attendance'"
        :meeting-id="meeting.id"
        />

      </div>

      <!-- Activities Tab -->
      <div
        v-if="activeTab === 'activities'"
        class="bg-white border rounded-lg p-4 text-sm text-gray-600"
      >
        <!-- Placeholder for now -->
        Activities (Referrals, F2F, Appreciation) will appear here.
      </div>
    </div>

    <!-- Not found -->
    <div v-else class="text-center text-red-500">
      Meeting not found
    </div>
  </div>
</template>
