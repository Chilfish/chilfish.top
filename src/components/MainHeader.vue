<script setup lang="ts">

</script>

<template>
  <header
    class="flex gap-4 p-2xl transition-all"
  >
    <div>
      <h1
        class="text-3xl font-bold transition-all"
        sm="text-5xl"
      >
        <div> Hi, there 😇 </div>
        <div class="mt-2">
          I'm Chilfish.
        </div>
      </h1>
      <p class="my-2xl w-full">
        a new starter of frontend developing
      </p>
    </div>

    <NuxtImg
      class="ml-xl hidden h-24 rounded-2"
      sm="inline-block h-48"
      src="/avatar-512x512.png"
      alt="avatar"
      loading="lazy"
    />
  </header>
</template>
