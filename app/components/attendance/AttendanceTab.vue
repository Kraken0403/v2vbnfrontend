<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AttendanceRow from './AttendanceRow.vue'

type AttendanceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'SUBSTITUTE'
  | 'MEDICAL'
  | 'LATE'

const props = defineProps<{
  meetingId: number
}>()

const { $api } = useNuxtApp()
const { open } = useSnackbar()

const loading = ref(true)
const saving = ref(false)
const seatingMissing = ref(false)

type Row = {
  sequence_number: number
  member: {
    id: number
    full_name: string
    company_name?: string | null
    designation?: string | null
    category?: string | null
    profile?: { photo_url?: string | null } | null
  }
  status: AttendanceStatus
  substitute_name: string | null
  is_auto_generated: boolean
  marked_by_role: string | null
  marked_at: string | null
}

const rows = ref<Row[]>([])

/**
 * 🔑 Always render in seating order
 */
const orderedRows = computed(() =>
  [...rows.value].sort(
    (a, b) => a.sequence_number - b.sequence_number,
  ),
)

/**
 * 📥 Fetch attendance
 */
const fetchAttendance = async () => {
  loading.value = true
  try {
    const { data } = await $api.get(
      `/meetings/${props.meetingId}/attendance`,
    )

    seatingMissing.value = !!data.seating_missing
    rows.value = data.rows || []
  } catch (e: any) {
    open(
      e?.response?.data?.message ??
        'Failed to load attendance',
      'error',
    )
    rows.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAttendance()
  window.addEventListener('attendance-refresh', fetchAttendance)
})

onUnmounted(() => {
  window.removeEventListener('attendance-refresh', fetchAttendance)
})

/**
 * 🔹 Quick actions
 */
const markAll = (status: AttendanceStatus) => {
  rows.value = rows.value.map((r) => ({
    ...r,
    status,
    substitute_name:
      status === 'SUBSTITUTE'
        ? r.substitute_name ?? ''
        : null,
  }))
}

/**
 * 💾 Bulk save
 */
const saveAll = async () => {
  saving.value = true
  try {
    await $api.patch(
      `/meetings/${props.meetingId}/attendance`,
      {
        rows: rows.value.map((r) => ({
          member_id: r.member.id,
          status: r.status,
          substitute_name:
            r.status === 'SUBSTITUTE'
              ? r.substitute_name ?? ''
              : undefined,
        })),
      },
    )

    open('Attendance saved', 'success')
    await fetchAttendance()
  } catch (e: any) {
    open(
      e?.response?.data?.message ??
        'Failed to save attendance',
      'error',
    )
  } finally {
    saving.value = false
  }
}

/**
 * 📤 Export attendance as Excel
 */
const exportAttendance = async () => {
  try {
    const response = await $api.get(
      `/meetings/${props.meetingId}/attendance/export`,
      {
        responseType: 'blob',
      },
    )

    const blob = new Blob([response.data], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `attendance-meeting-${props.meetingId}.xlsx`
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (e: any) {
    open(
      e?.response?.data?.message ??
        'Failed to export attendance',
      'error',
    )
  }
}
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="text-center text-gray-500 py-6">
      Loading attendance...
    </div>

    <div v-else>
      <!-- Seating missing -->
      <div
        v-if="seatingMissing"
        class="mb-3 p-3 rounded-lg border bg-yellow-50 text-yellow-800 text-sm"
      >
        Seating arrangement not uploaded yet.
        Attendance will appear after seating is set.
      </div>

      <!-- Attendance list -->
      <div v-if="orderedRows.length" class="space-y-3">
        <!-- Quick actions -->
        <div class="flex gap-2">
          <button
            class="flex-1 border rounded-lg py-2 text-sm"
            @click="markAll('PRESENT')"
          >
            Mark all Present
          </button>
          <button
            class="flex-1 border rounded-lg py-2 text-sm"
            @click="markAll('ABSENT')"
          >
            Mark all Absent
          </button>
        </div>

        <!-- Rows -->
        <AttendanceRow
          v-for="r in orderedRows"
          :key="r.member.id"
          :row="r"
          :meeting-id="meetingId"
          @updated="fetchAttendance"
        />

        <!-- Actions -->
        <div class="flex gap-2 pt-2">
          <button
            @click="exportAttendance"
            class="flex-1 border border-gray-300 bg-white text-gray-700 py-2 rounded-lg font-medium"
          >
            Export Attendance
          </button>

          <button
            @click="saveAll"
            :disabled="saving"
            class="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-60"
          >
            {{ saving ? 'Saving...' : 'Save Attendance' }}
          </button>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="text-center text-gray-500 py-6">
        No attendance rows yet.
      </div>
    </div>
  </div>
</template>
