<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  row: any
  meetingId: number
}>()

const emit = defineEmits(['updated'])
const { $api } = useNuxtApp()
const { open } = useSnackbar()

const status = ref(props.row.status)
const substitute = ref(props.row.substitute_name || '')

/**
 * 🔁 Keep UI in sync when parent refreshes
 */
watch(
  () => props.row,
  (r) => {
    status.value = r.status
    substitute.value = r.substitute_name || ''
  },
  { deep: true },
)

/**
 * 🏷 Badge text
 */
const badgeText = computed(() => {
  if (props.row.is_auto_generated) return 'Auto (Default)'
  if (props.row.marked_by_role)
    return `Updated by ${props.row.marked_by_role}`
  return 'Updated'
})

/**
 * 🕒 Formatted timestamp
 */
const formattedTime = computed(() => {
  if (!props.row.marked_at) return null
  return new Date(props.row.marked_at).toLocaleString()
})

const save = async () => {
  try {
    await $api.patch(
      `/meetings/${props.meetingId}/attendance/${props.row.member.id}`,
      {
        status: status.value,
        substitute_name:
          status.value === 'SUBSTITUTE'
            ? substitute.value
            : null,
      },
    )

    emit('updated')
  } catch {
    open('Failed to update attendance', 'error')
  }
}
</script>

<template>
  <div class="bg-white border rounded-xl p-3 flex gap-3">
    <!-- Order -->
    <div class="text-xs text-gray-400 pt-1 w-6 text-right">
      {{ row.sequence_number }}
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <!-- Name -->
      <div class="font-medium text-sm truncate">
        {{ row.member.full_name }}
      </div>

      <!-- Company -->
      <div class="text-xs text-gray-500 truncate">
        {{ row.member.company_name || '—' }}
      </div>

      <!-- Audit info -->
      <div class="mt-1 flex items-center gap-2 flex-wrap">
        <span
          class="text-[11px] px-2 py-0.5 rounded-full"
          :class="
            row.is_auto_generated
              ? 'bg-gray-100 text-gray-700'
              : 'bg-blue-100 text-blue-700'
          "
        >
          {{ badgeText }}
        </span>

        <span
          v-if="formattedTime"
          class="text-[11px] text-gray-400"
        >
          {{ formattedTime }}
        </span>
      </div>

      <!-- Status -->
      <select
        v-model="status"
        @change="save"
        class="mt-2 border rounded-lg p-1 text-sm w-full"
      >
        <option value="PRESENT">Present</option>
        <option value="ABSENT">Absent</option>
        <option value="LATE">Late</option>
        <option value="MEDICAL">Medical</option>
        <option value="SUBSTITUTE">Substitute</option>
      </select>

      <!-- Substitute -->
      <input
        v-if="status === 'SUBSTITUTE'"
        v-model="substitute"
        @blur="save"
        placeholder="Substitute name"
        class="mt-2 border rounded-lg p-1 text-sm w-full"
      />
    </div>
  </div>
</template>
