export const hostIcons = {
  'default': 'i-tabler:link',
  'github.com': 'i-simple-icons:github',
  'zhihu.com': 'i-simple-icons:zhihu',
  'twitter.com': 'i-simple-icons:twitter',
  'vercel.com': 'i-simple-icons:vercel',
  'bilibili.com': 'i-simple-icons:bilibili',
  'weibo.com': 'i-simple-icons:sinaweibo',
  'wakatime.com': 'i-simple-icons:wakatime',
  'sasslang.com': 'i-simple-icons:sass',
  'vitejs.dev': 'i-simple-icons:vite',
  'vuejs.org': 'i-simple-icons:vuedotjs',
  'react.dev': 'i-simple-icons:react',
  'nuxt.com': 'i-simple-icons:nuxtdotjs',
  'astro.build': 'i-simple-icons:astro',
  'unocss.dev': 'i-simple-icons:unocss',
  'juejin.cn': 'i-simple-icons:juejin',
  'stackoverflow.com': 'i-simple-icons:stackoverflow',
  'v2ex': 'i-simple-icons:v2ex',
  'dribbble.com': 'i-simple-icons:dribbble',
  'example.com': 'i-tabler:world',
  'google.com': 'i-simple-icons:google',
  'youtube.com': 'i-simple-icons:youtube',
  'baidu.com': 'i-simple-icons:baidu',
  'gitee.com': 'i-simple-icons:gitee',
  'docker.com': 'i-simple-icons:docker',
  'douban.com': 'i-simple-icons:douban',
  'android.com': 'i-simple-icons:android',
  'npmjs.com': 'i-simple-icons:npm',
} as const

export type HostIcons = typeof hostIcons
export type Hosts = keyof HostIcons

export const HostIconList = Object.values(hostIcons)

export function getHostIcon(hostname: string) {
  const mainDomain = hostname.split('.').slice(-2).join('.')
  const icon = hostIcons[mainDomain as Hosts] || hostIcons[hostname as Hosts] || hostIcons.default
  return icon
}
