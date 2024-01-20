import { defineConfig, squooshImageService } from 'astro/config'
import AutoImport from 'unplugin-auto-import/astro'
import AutoImportAstro from 'astro-auto-import'
import mdx from '@astrojs/mdx'
import UnoCSS from 'unocss/astro'
import vercel from '@astrojs/vercel/serverless'

// import vue from '@astrojs/vue'

const cp = (name: string) => `./src/components/common/${name}.astro`

// https://astro.build/config
export default defineConfig({
  integrations: [
    // vue({
    //   appEntrypoint: '/src/pages/_vue',
    //   jsx: true,
    // }),
    AutoImport({
      dts: 'src/types/auto-imports.d.ts',
    }),
    AutoImportAstro({
      imports: [
        cp('Alert'),
      ],
    }),
    mdx(),
    UnoCSS({
      injectReset: true,
    }),
  ],

  // SSR mode
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
  },
})
