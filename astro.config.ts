import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import node from '@astrojs/node'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import { defineConfig, envField } from 'astro/config'
import AutoImportAstro from 'astro-auto-import'
import expressiveCode from 'astro-expressive-code'
import UnoCSS from 'unocss/astro'
import AutoImport from 'unplugin-auto-import/astro'
import { host, imgHost } from './src/constant/config'
import { rehypePlugins, remarkPlugins } from './src/plugins'

const cp = (name: string) => `./src/components/common/${name}.astro`

const isNode = process.env.IS_NODE === 'TRUE'

const {
  NCM_API = '',
  NCM_UID = 1,
} = import.meta.env

// https://astro.build/config
export default defineConfig({
  site: host,
  // SSR mode
  output: 'server',
  adapter: isNode
    ? node({ mode: 'standalone' })
    : cloudflare(),
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
      theme: 'vitesse-dark',
    },
    rehypePlugins,
    remarkPlugins,
  },
  prefetch: true,
  image: {
    domains: [imgHost.replace(/https?:\/\//, '')],
  },
  vite: {
    ssr: {
      external: ['node:buffer'],
    },
  },
  experimental: {
    env: {
      schema: {
        NCM_API: envField.string({
          context: 'server',
          default: NCM_API,
          access: 'public',
        }),
        NCM_UID: envField.number({
          context: 'server',
          default: NCM_UID,
          access: 'public',
        }),
      },
    },
  },
})
