<script setup lang="ts">
import { appDescription, appName } from '~/constants'

const img = '/avatar-512x512.png'

useSeoMeta({
  ogUrl: useRoute().fullPath,
  twitterTitle: appName,
  twitterDescription: appName,
  twitterImage: img,
  twitterCard: 'summary_large_image',
  ogImage: img,
  ogDescription: appName,
  ogTitle: appName,
  title: appName,
  description: appDescription,
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.ico',
    },
  ],
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  --uno: bg-dark text-light m-0 p-0 h-100vh;
}
</style>
