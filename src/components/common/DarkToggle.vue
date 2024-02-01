<script setup lang="ts">
defineProps<{
  hidden?: boolean
}>()

const toggle = useToggle(isDark)
const icon = computed(() => isDark.value ? 'i-tabler-sun' : 'i-tabler-moon')
</script>

<template>
  <button
    class="icon-box"
    :class="{ hidden }"
    @click="() => toggle()"
  >
    <span
      class="icon"
      :class="icon"
    />
  </button>
</template>
