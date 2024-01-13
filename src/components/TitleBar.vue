<script setup lang="ts">
defineProps<{
  title: string
  url: string
}>()
</script>

<template>
  <h1
    class="flex items-center text-2xl font-bold"
  >
    <span>{{ title }}</span>
    <NuxtLink
      :no-rel="true"
      :to="url"
      class="i-tabler-arrow-up-right w-8" ml-auto icon inline-block h-8
      target="_blank"
      text="gray hover:light"
    />
  </h1>
</template>
