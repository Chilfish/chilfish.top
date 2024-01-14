<script setup lang="ts">
definePageMeta({
  redirect: '/', // or other
})
</script>

<template>
  <div class="center-col select-none gap-6 pt-8">
    <h1>404 URL {{ $route.fullPath }}</h1>
    <p>Oops! It seems like we've taken a wrong turn.</p>

    <div class="center gap-4">
      <NuxtLink class="btn" to="/">
        Go back
      </NuxtLink>

      <button
        class="btn"
        @click="navigateTo({ path: $route.fullPath })"
      >
        Refresh
      </button>
    </div>
  </div>
</template>
