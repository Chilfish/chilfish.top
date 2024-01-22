<script setup lang="ts">
defineProps<{
  hidden?: boolean
}>()

const dark = useDark({
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'theme',
  disableTransition: false,
})
const toggle = useToggle(dark)
const icon = computed(() => dark.value ? 'i-tabler-sun' : 'i-tabler-moon')
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
