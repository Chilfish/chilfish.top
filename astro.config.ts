import { defineConfig, squooshImageService } from 'astro/config'

// import vue from '@astrojs/vue'
import mdx from '@astrojs/mdx'
import UnoCSS from 'unocss/astro'
import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  integrations: [
    // vue({
    //   appEntrypoint: '/src/pages/_vue',
    //   jsx: true,
    // }),
    mdx(),
    UnoCSS({
      injectReset: true,
    }),
  ],
  output: 'server',
  adapter: vercel(),
  markdown: {
    shikiConfig: {
      theme: 'vitesse-dark',
      wrap: true,
    },
  },
  prefetch: true,
  image: {
    service: squooshImageService(),
    domains: [
      'p.chilfish.top',
    ],
  },
})
