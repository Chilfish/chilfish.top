<script setup lang="ts">
import { appDescription, appName } from '~/constants'

const host = useRequestURL().origin
const img = `${host}/avatar-512x512.png`

useSeoMeta({
  title: appName,
  description: appDescription,
  twitterTitle: appName,
  twitterDescription: appDescription,
  twitterImage: img,
  twitterCard: 'summary_large_image',
  ogUrl: host,
  ogImage: img,
  ogDescription: appDescription,
  ogTitle: appName,
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ],
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtLoadingIndicator />
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
