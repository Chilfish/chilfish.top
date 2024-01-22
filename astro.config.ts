import { defineConfig, squooshImageService } from 'astro/config'
import AutoImport from 'unplugin-auto-import/astro'
import AutoImportAstro from 'astro-auto-import'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import vue from '@astrojs/vue'
import UnoCSS from 'unocss/astro'
import vercel from '@astrojs/vercel/serverless'
import expressiveCode from 'astro-expressive-code'

import { host } from './src/constant/config'

const cp = (name: string) => `./src/components/common/${name}.astro`

// https://astro.build/config
export default defineConfig({
  site: host,

  // SSR mode
  output: 'server',
  adapter: vercel(),
  integrations: [
    vue({
      jsx: true,
    }),
    sitemap(),
    AutoImport({
      dts: 'src/types/auto-imports.d.ts',
      imports: ['vue', '@vueuse/core'],
      dirs: ['src/utils'],
    }),
    AutoImportAstro({
      imports: [cp('Alert')],
    }),
    expressiveCode({
      themes: ['vitesse-dark'],
      themeCssSelector: theme => `html.${theme.type}`,
      useThemedScrollbars: false,
      useThemedSelectionColors: false,
    }),
    mdx(),
    UnoCSS({
      injectReset: true,
    }),
  ],
  markdown: {
    shikiConfig: {
      experimentalThemes: {
        dark: 'vitesse-dark',
        // light: 'vitesse-light',
      },
    },
  },
  prefetch: true,
  image: {
    service: squooshImageService(),
  },
})
