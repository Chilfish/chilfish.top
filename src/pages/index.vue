<script setup lang="ts">
useHead({
  title: 'Chilfish',
})
</script>

<template>
  <MainHeader />
  <Socials />

  <Suspense>
    <Projects />
  </Suspense>

  <TitleBar
    title="Sponsors"
    url="/sponsors"
  />

  <Suspense>
    <Posts />
  </Suspense>

  <MainFooter />
</template>
