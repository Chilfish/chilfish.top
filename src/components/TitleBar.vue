<script setup lang="ts">
defineProps<{
  title: string
  url: string
}>()
</script>

<template>
  <h1
    class="my-8 flex items-center text-2xl font-bold"
  >
    <span>{{ title }}</span>
    <NuxtLink
      :no-rel="true"
      :to="url"
      :target="url.startsWith('http') ? '_blank' : '_self'"
      class="i-tabler-arrow-up-right ml-auto icon inline-block h-8 w-8"
      text="gray hover:light"
    />
  </h1>
</template>
