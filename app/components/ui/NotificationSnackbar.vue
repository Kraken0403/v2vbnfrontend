<script setup>
const { show, message, type, close } = useSnackbar()

const bgClass = computed(() => {
  switch (type.value) {
    case 'success':
      return 'bg-green-600'
    case 'error':
      return 'bg-red-600'
    default:
      return 'bg-blue-600'
  }
})
</script>

<template>
  <transition name="slide-up">
    <div
      v-if="show"
      class="fixed bottom-6 left-1/2 -translate-x-1/2
             text-white px-6 py-3 rounded-lg shadow-lg
             flex items-center space-x-4 z-50"
      :class="bgClass"
    >
      <span class="text-sm font-medium">
        {{ message }}
      </span>

      <button
        @click="close"
        class="text-white/80 hover:text-white text-lg leading-none"
      >
        ×
      </button>
    </div>
  </transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
