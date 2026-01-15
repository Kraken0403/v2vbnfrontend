<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMeetings } from '@/composables/useMeetings'
import { useMemberProfile } from '@/composables/useMemberProfile'

definePageMeta({
  middleware: ['auth'],
  layout: 'member',
})

/* =======================
   PROFILE
   ======================= */
const profileStore = useMemberProfile()
const member = computed(() => profileStore.profile ?? null)

/* =======================
   MEETINGS
   ======================= */
const { getMyMeetings, closeMeeting } = useMeetings()

const meetings = ref<any[]>([])
const loading = ref(true)

/* =======================
   LEADERSHIP CHECK
   ======================= */
const isLeadership = computed(() => {
  if (!member.value) return false
  if (!Array.isArray(member.value.roles)) return false

  return member.value.roles.some((r: any) =>
    ['PRESIDENT', 'VP', 'ST'].includes(r.role),
  )
})

/* =======================
   LOAD DATA
   ======================= */
const loadMeetings = async () => {
  loading.value = true
  try {
    meetings.value = await getMyMeetings()
  } catch (e) {
    console.error('Failed to load meetings', e)
    meetings.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadMeetings)

/* =======================
   CLOSE MEETING
   ======================= */
const closingId = ref<number | null>(null)

async function handleClose(id: number) {
  if (!confirm('Close this meeting? This cannot be undone.')) return

  closingId.value = id
  try {
    await closeMeeting(id)
    await loadMeetings()
  } catch (e) {
    console.error(e)
    alert('Failed to close meeting')
  } finally {
    closingId.value = null
  }
}


</script>


<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">Chapter Meetings</h1>

      <NuxtLink
        v-if="isLeadership"
        to="/member/meetings/create"
        class="btn-primary"
      >
        + Create Meeting
      </NuxtLink>
    </div>

    <div v-if="pending" class="text-gray-500">
      Loading meetings…
    </div>

    <div v-else-if="!meetings.length" class="text-gray-500">
      No meetings yet.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="m in meetings"
        :key="m.id"
        class="border rounded-lg p-4 flex justify-between items-center"
      >
        <div>
          <div class="font-medium">{{ m.title }}</div>
          <div class="text-sm text-gray-500">
            {{ new Date(m.meeting_at).toLocaleString() }}
          </div>
          <div
            v-if="m.status === 'CLOSED'"
            class="text-xs text-red-600 mt-1"
          >
            Closed
          </div>
        </div>

        <div class="flex gap-2">
          <NuxtLink
            :to="`/member/meetings/${m.id}`"
            class="btn-secondary"
          >
            View
          </NuxtLink>

          <NuxtLink
            v-if="isLeadership && m.status === 'OPEN'"
            :to="`/member/meetings/${m.id}/edit`"
            class="btn-secondary"
          >
            Edit
          </NuxtLink>

          <button
            v-if="isLeadership && m.status === 'OPEN'"
            class="btn-danger"
            :disabled="closingId === m.id"
            @click="handleClose(m.id)"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
