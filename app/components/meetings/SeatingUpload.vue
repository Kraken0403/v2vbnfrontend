<script setup lang="ts">
import * as XLSX from 'xlsx'

const props = defineProps<{
  meetingId: number
}>()

const { $api } = useNuxtApp()
const { open } = useSnackbar()

const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// map: normalized name -> member_id
const memberMap = ref<Record<string, number>>({})

/**
 * Normalize string for matching
 */
const normalize = (v: string) =>
  v.toLowerCase().replace(/\s+/g, '').trim()

/**
 * Fetch allowed seating candidates
 */
const fetchCandidates = async () => {
  const { data } = await $api.get(
    `/meetings/${props.meetingId}/seating/candidates`,
  )

  memberMap.value = {}
  data.forEach((m: any) => {
    memberMap.value[normalize(m.full_name)] = m.id
  })
}

onMounted(fetchCandidates)

/**
 * Handle Excel upload
 */
const handleFile = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploading.value = true

  try {
    const buf = await file.arrayBuffer()
    const workbook = XLSX.read(buf)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<any>(sheet)

    if (!rows.length) {
      open('Excel is empty', 'error')
      return
    }

    const members: { member_id: number; sequence_number: number }[] = []

    rows.forEach((row, index) => {
      const name =
        row['Member Name'] ||
        row['member_name'] ||
        row['Name']

      if (!name) return

      const key = normalize(String(name))
      const memberId = memberMap.value[key]

      if (!memberId) {
        throw new Error(`Member not found: ${name}`)
      }

      members.push({
        member_id: memberId,
        sequence_number: index + 1,
      })
    })

    await $api.post(`/meetings/${props.meetingId}/seating`, {
      members,
    })

    open('Seating arrangement uploaded', 'success')

    // hard refresh attendance automatically
    window.dispatchEvent(new Event('attendance-refresh'))
  } catch (e: any) {
    open(e.message ?? 'Invalid seating file', 'error')
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="space-y-3">
    <div class="text-sm text-gray-600">
      Upload seating arrangement Excel to define attendance order.
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".xlsx,.xls"
      @change="handleFile"
      class="block w-full text-sm"
    />

    <button
      :disabled="uploading"
      class="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-60"
    >
      {{ uploading ? 'Uploading...' : 'Upload Seating' }}
    </button>

    <button
      class="w-full border rounded-lg py-2 text-sm"
      @click="$api.post(`/meetings/${meetingId}/seating/use-last`)
        .then(() => open('Previous seating applied', 'success'))"
    >
      Use Last Meeting Seating
    </button>
  </div>
</template>
