<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import SponsorGateModal from '@/components/advertisement/SponsorGateModal.vue'
import RosterHeader from '@/components/roster/RosterHeader.vue'
import RosterCard from '@/components/roster/RosterCard.vue'
import { useHead } from '#imports'

const route = useRoute()
const { $api } = useNuxtApp()

useHead(() => {
  if (!chapter.value) {
    return {
      title: 'Shrinathji Chapter Roster | V2VBN',
    }
  }

  return {
    title: `${chapter.value.name} Chapter Roster | V2VBN`,
    meta: [
      {
        name: 'description',
        content: `Official member roster of ${chapter.value.name} Chapter, V2VBN.`,
      },
    ],
  }
})

/* ============================
   STATE
============================ */
const loading = ref(true)
const chapter = ref(null)
const search = ref('')
const showSponsorModal = ref(true)
const rosterRef = ref(null)

/* ============================
   ROLE PRIORITY
============================ */
const ROLE_PRIORITY = {
  PRESIDENT: 1,
  VP: 2,
  ST: 3,
  MENTOR: 4,
  CORE: 5,
  ATTENDANCE_COORDINATOR: 6,
  MEMBER_GROWTH_COORDINATOR: 7,
  APPLICATION_REVIEW_COORDINATOR: 8,
  RETENTION_COORDINATOR: 9,
  POLICY_PROCEDURE_COORDINATOR: 10,
  F2F_COORDINATOR: 11,
  REFERRAL_CHECK_COORDINATOR: 12,
  APPRECIATION_NOTE_COORDINATOR: 13,
  MENTOR_COORDINATOR: 14,
  LEAD_VISITOR_HOST: 15,
  SPOTLIGHT_COORDINATOR: 16,
  KYM_COORDINATOR: 17,
  KNOWLEDGE_SLOT_COORDINATOR: 18,
  MEDIA_HOST_COORDINATOR: 19,
  SOCIAL_MEDIA_COORDINATOR: 20,
  EVENTS_COORDINATOR: 21,
  TRAINING_COORDINATOR: 22,
  APPLICATION_COORDINATOR: 23,
  SPECIFIC_ASK_COORDINATOR: 24,
  I_COMMIT_COORDINATOR: 25,
}

/* ============================
   FETCH
============================ */
onMounted(async () => {
  try {
    const { data } = await $api.get(
      `/public/chapters/${route.params.slug}/roster`,
    )
    chapter.value = data
  } catch {
    chapter.value = null
  } finally {
    loading.value = false
  }
})

function handleSponsorContinue() {
  showSponsorModal.value = false
}

/* ============================
   SORT + FILTER
============================ */
function rolePriority(roles = []) {
  if (!roles.length) return 999
  return Math.min(...roles.map(r => ROLE_PRIORITY[r.role] || 999))
}

const filteredMembers = computed(() => {
  if (!chapter.value) return []

  const q = search.value.toLowerCase().trim()

  return chapter.value.member_links
    .filter(({ member }) =>
      !q ||
      member.full_name?.toLowerCase().includes(q) ||
      member.company_name?.toLowerCase().includes(q) ||
      member.category?.toLowerCase().includes(q)
    )
    .sort((a, b) => rolePriority(a.roles) - rolePriority(b.roles))
})

/* ============================
   EXPORT PDF (CLIENT SAFE)
============================ */
async function exportPDF() {
  if (!process.client || !rosterRef.value) return

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const canvas = await html2canvas(rosterRef.value, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#f9fafb',
  })

  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF('p', 'mm', 'a4')

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()

  const imgWidth = pdfWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 0

  // First page
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pdfHeight

  // Extra pages
  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight
  }

  pdf.save(`${chapter.value.name}-roster.pdf`)
}

</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <SponsorGateModal
      v-if="showSponsorModal"
      :duration="5"
      @continue="handleSponsorContinue"
    />

    <div v-if="loading" class="p-6 text-center text-gray-500">
      Loading chapter roster...
    </div>

    <div v-else-if="chapter">
      <!-- PDF AREA -->
      <div ref="rosterRef" class="bg-gray-50">
        <RosterHeader :chapter="chapter" />

        <!-- Search -->
        <div class="px-4 pt-4">
          <input
            v-model="search"
            type="text"
            placeholder="Search by name, company or category..."
            class="w-full rounded-lg border px-4 py-2 text-sm"
          />
        </div>

        <!-- Members -->
        <div class="p-4 space-y-3">
          <RosterCard
            v-for="item in filteredMembers"
            :key="item.member.id"
            :member="item.member"
            :roles="item.roles"
          />
        </div>
      </div>

      <!-- EXPORT -->
      <!-- <div class="px-4 py-6 flex justify-center">
        <button
          @click="exportPDF"
          class="px-6 py-2 rounded-lg
                 bg-blue-600 text-white
                 font-medium hover:bg-blue-700"
        >
          Export Roster to PDF
        </button>
      </div> -->

      <!-- THANK YOU -->
      <div class="px-6 pb-10 text-center text-sm text-gray-500">
        Thank you for being a valued member of <b>V2VBN</b>.
        Together, we grow through trust, collaboration, and commitment.
      </div>
    </div>

    <div v-else class="p-6 text-center text-red-500">
      Chapter not found
    </div>
  </div>
</template>
