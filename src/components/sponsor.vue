<script setup lang="ts">
import type { Sponsor } from '~/constants'

defineProps<{
  sponsors: Sponsor[]
}>()
</script>

<template>
  <div
    class="w-full center-col gap-4"
  >
    <div
      v-for="sponsor in sponsors"
      :key="sponsor.id"
      class="w-full flex flex-col justify-center rounded-2 shadow-red"
      bg="dark-7"
    >
      <div class="flex items-center justify-between p-3">
        <span class="text-lg font-bold">
          {{ sponsor.name }}
        </span>
        <span class="text-gray">
          {{ sponsor.time }}
        </span>
      </div>

      <div class="px-3 py-4 text-3.5">
        <p class="text-gray">
          留言：{{ sponsor.message }}
        </p>
        <p class="mt-2 text-orange">
          开发者回复：{{ sponsor.reply }}
        </p>
      </div>

      <div class="rounded-b-2 bg-red p-2 text-end text-lg font-bold">
        ￥{{ sponsor.amount.toFixed(2) }}
      </div>
    </div>
  </div>
</template>
