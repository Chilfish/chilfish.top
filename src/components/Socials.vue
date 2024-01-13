<script setup lang="ts">
import { Socials as _socials } from '~/constants'

const Socials = useState('Socials', () => _socials)
</script>

<template>
  <div>
    <NuxtLink
      v-for="social in Socials"
      :key="social.name"
      class="mr-2 mt-2 inline-flex rounded-md bg-#373738 px-3 py-2 text-center decoration-none transition-colors hover:text-white"
      :class="social.class"
      :href="social.link"
      :no-rel="true"
      target="_blank"
    >
      <div
        :class="social.icon"
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
