<script setup>
const { user } = useAuth()
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">
      Welcome, {{ user?.member?.full_name }}
    </h1>

    <div class="bg-white rounded-xl p-6 shadow">
      <p><b>Company:</b> {{ user?.member?.company_name }}</p>
      <p><b>Email:</b> {{ user?.email }}</p>

      <div class="mt-4">
        <h2 class="font-medium mb-2">Chapters</h2>
        <ul class="list-disc pl-5">
          <li
            v-for="c in user?.member?.chapters"
            :key="c.chapter.id"
          >
            {{ c.chapter.name }} —
            {{ c.roles.map(r => r.role).join(', ') }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
