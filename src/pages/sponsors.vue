<script setup lang="ts">
import { SponsorList, imgHost } from '~/constants'
</script>

<template>
  <div class="flex flex-col justify-center gap-6 py-8">
    <h2 class="text-2xl font-bold">
      <NuxtLink to="/">
        <span class="i-tabler-arrow-left mr-2 icon h-5 w-5" />
      </NuxtLink>
      <span>赞助我</span>
    </h2>

    <p>
      如果你觉得我的项目或者文章对你有所帮助，欢迎赞助我，这对我有很大的帮助，让我有更多的时间和精力去开发 *Heart ❤️。
    </p>

    <details
      class="rounded-md bg-dark-6 trans-all"
    >
      <summary
        class="rounded-md bg-dark-8 p-4"
        border="~ dark-7"
      >
        <strong>点击展开赞赏码</strong>
      </summary>

      <p class="m-4">
        可以留下你的昵称和留言~❤️
      </p>

      <div class="center p-4">
        <NuxtImg
          :src="`${imgHost}/wx_reward.png`"
          alt="微信赞赏码"
          width="300"
          loading="lazy"
          class="rounded-2"
        />
      </div>
    </details>

    <Sponsor :sponsors="SponsorList" />
  </div>
</template>
