<script setup lang="ts">
const socials = useState('socialsMap', () => [
  {
    name: 'blog',
    text: 'Blog',
    link: 'https://note.chilfish.top',
    icon: 'i-ri-book-2-line',
    class: 'hover:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900',
  },
  {
    name: 'github',
    text: '',
    link: 'https://github.com/Chilfish',
    icon: 'i-ri-github-fill',
    class: 'hover:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900',
  },
  {
    name: 'mail',
    text: '',
    link: 'mailto:chill4fish@gmail.com',
    icon: 'i-ri-mail-fill',
    class: 'hover:bg-[#E84234]',
  },
  {
    name: 'twitter',
    text: '',
    link: 'https://twitter.com/chilllish',
    icon: 'i-fa-brands-twitter',
    class: 'hover:bg-[#00ACEE]',
  },
  {
    name: 'tel',
    text: '',
    link: 'https://t.me/Chilfish',
    icon: 'i-ri-telegram-fill',
    class: 'hover:bg-[#0088CC]',
  },
  {
    name: 'discord',
    text: '',
    link: 'https://discord.com/users/1039168181215961199',
    icon: 'i-ic-baseline-discord',
    class: 'hover:bg-[#5865F2]',
  },
  {
    name: 'weibo',
    text: '',
    link: 'https://weibo.com/chilfish',
    icon: 'i-fa-brands-weibo',
    class: 'hover:bg-[#FF8200]',
  },
  {
    name: 'bili',
    text: '',
    link: 'https://space.bilibili.com/259486090',
    icon: 'i-ri-bilibili-fill',
    class: 'hover:bg-[#fb7299]',
  },
  {
    name: 'zhihu',
    text: '',
    link: 'https://www.zhihu.com/people/Walmart_Zelo',
    icon: 'i-ri-zhihu-line',
    class: 'hover:bg-[#558EFF]',
  },
  {
    name: '163',
    text: '',
    link: 'https://music.163.com/user/home?id=1533509979',
    icon: 'i-ri-netease-cloud-music-line',
    class: 'hover:bg-[#DD001B]',
  },
],
)
</script>

<template>
  <div>
    <a
      v-for="social in socials" :key="social.name"
      class="mr-2 mt-2 inline-flex rounded-md px-3 py-2 decoration-none transition-colors hover:text-white"
      bg-gray-8 text-center
      :class="social.class"
      :href="social.link"
      target="_blank"
    >
      <div
        :class="social.icon"
        text-xl
      />
      <div
        v-if="social.text"
        ml-1 text-sm
      >{{ social.text }}</div>
    </a>
  </div>
</template>
