<script setup>
defineProps({
  chapter: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="bg-white shadow-sm w-full">
    <div class="p-6 flex flex-col items-center text-center gap-3">

      <!-- Logo -->
      <img
        src="/logo-v2vbn.png"
        alt="V2VBN Logo"
        class="max-w-[180px]"
      />

      <!-- Chapter Name -->
      <h1
        class="text-[28px] md:text-[32px] font-bold tracking-tight"
        style="color:#0B3C5D"
      >
        {{ chapter.name }} Chapter
      </h1>

      <!-- City -->
      <p class="text-[16px] text-gray-500">
        {{ chapter.city }}
      </p>

            <!-- Divider -->
    <div class="w-[60px] h-[3px] rounded-full bg-gradient-to-r from-blue-700 to-teal-500 mt-3"></div>

      <!-- Description -->
      <p class="max-w-[720px] text-[15px] text-gray-600 leading-relaxed mt-2">
        The <span class="font-semibold text-gray-700">Shrinathji Chapter</span>
        is the <strong>very first chapter of V2VBN</strong> — founded with the vision of
        building a values-driven business network rooted in trust,
        collaboration, and Vaishnav principles.
        Established under the guidance and blessings of
        <span class="font-medium text-gray-700">J J Shree</span>,
        this chapter laid the foundation for what V2VBN represents today:
        meaningful connections, ethical growth, and collective progress.
      </p>

      <!-- Divider -->
      <div class="w-[60px] h-[3px] rounded-full bg-gradient-to-r from-blue-700 to-teal-500 mt-3"></div>

      <!-- Member Count -->
      <p class="mt-3 text-[12px] font-semibold uppercase tracking-wide text-gray-400">
        {{ chapter.member_links.length }} Members
      </p>
    </div>
  </div>
</template>
