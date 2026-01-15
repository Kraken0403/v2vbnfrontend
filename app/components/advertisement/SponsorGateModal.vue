<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  duration: {
    type: Number,
    default: 5, // seconds
  },
})

const emit = defineEmits(['continue'])

const timeLeft = ref(props.duration)
const enabled = ref(false)

let interval = null

onMounted(() => {
  interval = setInterval(() => {
    timeLeft.value--

    if (timeLeft.value <= 0) {
      enabled.value = true
      clearInterval(interval)
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
})

function proceed() {
  if (!enabled.value) return
  emit('continue')
}
</script>

<template>
  <!-- Overlay -->
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center
           bg-black/70 backdrop-blur-sm"
  >
    <!-- Modal -->
    <div
      class="w-[90%] max-w-md rounded-2xl bg-white p-6 text-center
             shadow-2xl animate-fadeIn"
    >
          <!-- Content -->
      <h2 class="text-[18px] font-semibold text-gray-800">
        Sponsored By
      </h2>
        <div class="w-[40px] mx-auto h-[3px] my-[5px] rounded-full bg-gradient-to-r from-blue-700 to-teal-500 mt-3"></div>

      <!-- Sponsor Image -->
      <img
        src="/sponsor1.png"
        alt="Sponsor"
        class="mx-auto mb-4 h-32 object-contain"
      />



      <p class="mt-2 text-[18px] text-gray-600">
        Thanks to our valued sponsor <strong>NG Water Processor & Mr. Nishant Jhansari</strong> for supporting Shrinathji chapter.
        Your support makes these connections possible.
      </p>

      <!-- CTA -->
      <button
        @click="proceed"
        :disabled="!enabled"
        class="mt-6 w-full rounded-xl py-3 text-sm font-semibold
               transition-all duration-300
               disabled:cursor-not-allowed disabled:bg-gray-300
               disabled:text-gray-500
               bg-blue-600 text-white hover:bg-blue-700"
      >
        <span v-if="!enabled">
          Continue in {{ timeLeft }}s
        </span>
        <span v-else>
          Continue to Roster
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}
</style>
