<script setup lang="ts">
import { Socials } from '~/constants'
</script>

<template>
  <div>
    <NuxtLink
      v-for="social in Socials"
      :key="social.name"
      class="mr-2 mt-2 inline-flex rounded-md bg-gray-8 px-3 py-2 text-center decoration-none transition-colors hover:text-white"
      :class="social.class"
      :href="social.link"
      :no-rel="true"
      target="_blank"
    >
      <div
        :class="social.icon"
        class="text-xl"
      />
      <div
        v-if="social.text"
        class="ml-1 text-sm"
      >
        {{ social.text }}
      </div>
    </NuxtLink>
  </div>
</template>
