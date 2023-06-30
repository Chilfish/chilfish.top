<script setup lang="ts">
useHead({
  title: 'Chill Nuxt',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
:root {
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: #ffffffde;
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

#__nuxt {
  background-color: #242424;
  min-height: 100vh;
}
</style>
