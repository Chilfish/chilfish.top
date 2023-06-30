<script setup lang="ts">
definePageMeta({
  layout: 'me',
})
useHead({
  title: 'Chilfish',
  link: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
  ],
})
</script>

<template>
  <header mt-3xl w-full flex justify-between p-2xl transition-all>
    <div>
      <h1
        text-3xl font-bold sm:text-5xl transition-all
      >
        <div> Hi, there 😇 </div>
        <div mt-2>
          I'm Chilfish.
        </div>
      </h1>
      <p my-2xl w-full>
        a new starter of frontend developing
      </p>
    </div>
    <img
      ml-xl h-35 w-35 rounded-2 transition-all sm:h-48 sm:w-48
      src="/avatar.jpg"
    >
  </header>

  <main>
    <Socials />
  </main>
</template>
