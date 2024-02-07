<script setup lang="ts">
import Giscus from '@giscus/vue'

const theme = computed(() => isDark.value ? 'dark' : 'light')
</script>

<template>
  <div class="mt-12">
    <Giscus
      repo="chilfish/chilfish.top"
      repo-id="R_kgDOJInwOA"
      category="General"
      category-id="DIC_kwDOJInwOM4CdAZu"
      mapping="title"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      loading="lazy"
      crossorigin="anonymous"
      async
      :theme="theme"
    />
  </div>
</template>
