<script setup lang="ts">
type Member = {
  id: number
  full_name: string
  company_name?: string | null
  designation?: string | null
  profile?: { photo_url?: string | null } | null
}

const props = defineProps<{
  meetingId: number
}>()

const { $api } = useNuxtApp()
const { open } = useSnackbar()

const loading = ref(true)
const saving = ref(false)

const members = ref<Member[]>([])
const draggedIndex = ref<number | null>(null)

/**
 * Fetch candidates OR existing seating
 */
const fetchSeating = async () => {
  loading.value = true
  try {
    // try current seating first
    const { data } = await $api.get(`/meetings/${props.meetingId}/seating`)
    if (data.members?.length) {
      members.value = data.members.map((m: any) => m.member)
      return
    }

    // fallback to candidates
    const res = await $api.get(
      `/meetings/${props.meetingId}/seating/candidates`,
    )
    members.value = res.data
  } catch {
    open('Failed to load seating', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(fetchSeating)

/**
 * Drag handlers
 */
const onDragStart = (index: number) => {
  draggedIndex.value = index
}

const onDrop = (index: number) => {
  if (draggedIndex.value === null) return

  const moved = members.value.splice(draggedIndex.value, 1)[0]
  members.value.splice(index, 0, moved)

  draggedIndex.value = null
}

/**
 * Save seating
 */
const saveSeating = async () => {
  saving.value = true
  try {
    await $api.post(`/meetings/${props.meetingId}/seating`, {
      members: members.value.map((m, idx) => ({
        member_id: m.id,
        sequence: idx + 1,
      })),
    })

    open('Seating saved successfully', 'success')

    // let attendance tab refresh
    window.dispatchEvent(new Event('attendance-refresh'))
  } catch (e: any) {
    open(e?.response?.data?.message ?? 'Failed to save seating', 'error')
  } finally {
    saving.value = false
  }
}

/**
 * Use last meeting seating
 */
const useLast = async () => {
  try {
    await $api.post(`/meetings/${props.meetingId}/seating/use-last`)
    open('Previous seating applied', 'success')
    await fetchSeating()
    window.dispatchEvent(new Event('attendance-refresh'))
  } catch (e: any) {
    open(e?.response?.data?.message ?? 'No previous seating found', 'error')
  }
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="text-center text-gray-500 py-6">
      Loading seating…
    </div>

    <div v-else>
      <!-- Actions -->
      <div class="flex gap-2">
        <button
          class="flex-1 border rounded-lg py-2 text-sm"
          @click="useLast"
        >
          Use Last Seating
        </button>

        <button
          class="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm"
          :disabled="saving"
          @click="saveSeating"
        >
          {{ saving ? 'Saving…' : 'Save Seating' }}
        </button>
      </div>

      <!-- Draggable list -->
      <div class="mt-4 space-y-2">
        <div
          v-for="(m, index) in members"
          :key="m.id"
          draggable="true"
          @dragstart="onDragStart(index)"
          @dragover.prevent
          @drop="onDrop(index)"
          class="bg-white border rounded-xl p-3 flex items-center gap-3 cursor-move"
        >
          <div
            class="w-7 h-7 rounded-full bg-gray-100 text-xs flex items-center justify-center font-medium"
          >
            {{ index + 1 }}
          </div>

          <div class="min-w-0">
            <div class="font-medium truncate">
              {{ m.full_name }}
            </div>
            <div class="text-xs text-gray-500 truncate">
              {{ m.company_name || '—' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
