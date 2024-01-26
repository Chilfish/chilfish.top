<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'

defineProps<{
  hidden?: boolean
}>()

const cookies = useCookies(['theme'])

const dark = useDark({
  storageKey: 'theme',
  disableTransition: false,
  onChanged(_isDark, defaultHandler, mode) {
    cookies.set('theme', mode, {
      expires: new Date('2038-01-19T03:14:07'),
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10,
      sameSite: 'strict',
    })
    defaultHandler(mode)
  },
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
