<script setup>
import MemberSidebar from '@/components/member/MemberSidebar'
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Sidebar -->
    <MemberSidebar />

    <!-- Content -->
    <div class="flex-1 flex flex-col">
      <MemberTopbar />

      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
