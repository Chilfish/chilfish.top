<script setup lang="ts">

</script>

<template>
  <footer
    class="center gap-2 py-4 text-3 text-gray-5"
  >
    <p>MIT Licensed | Copyright © 2023-{{ new Date().getFullYear() }} </p>
    <NuxtLink
      :no-rel="true"
      to="https://github.com/Chilfish"
      class="hover:underline"
    >
      Chilfish
    </NuxtLink>
  </footer>
</template>
