import { defineConfig, squooshImageService } from 'astro/config'
import AutoImport from 'unplugin-auto-import/astro'
import AutoImportAstro from 'astro-auto-import'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import UnoCSS from 'unocss/astro'
import vercel from '@astrojs/vercel/serverless'
import expressiveCode from 'astro-expressive-code'

const cp = (name: string) => `./src/components/common/${name}.astro`

// https://astro.build/config
export default defineConfig({
  site: 'https://astro.chilfish.top',
  // SSR mode
  output: 'server',
  adapter: vercel(),

  integrations: [
    sitemap(),
    AutoImport({
      dts: 'src/types/auto-imports.d.ts',
    }),
    AutoImportAstro({
      imports: [
        cp('Alert'),
      ],
    }),
    expressiveCode({
      themes: ['vitesse-dark', 'vitesse-light'],
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
        light: 'vitesse-light',
      },
    },
  },
  prefetch: true,
  image: {
    service: squooshImageService(),
  },
})
