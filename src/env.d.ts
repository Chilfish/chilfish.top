/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GITHUB_TOKEN: string
  readonly NCM_UID: number
  readonly NCM_API: string
  readonly NCM_COOKIE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'rehype-figure' {

  const rehypeFigure: () => any
  export default rehypeFigure
}

declare module 'sanitize-html' {
  export default function sanitizeHtml(
    html: string,
    options?: Record<string, unknown>,
  ): string
}

declare module 'markdown-it' {
  import type { PluginSimple } from 'markdown-it/lib'
  import type { Options } from 'markdown-it/lib'

  interface MarkdownIt {
    use(plugin: PluginSimple, ...params: unknown[]): this
    render(md: string): string
  }

  const MarkdownIt: {
    new (options?: Options): MarkdownIt
  }

  export default MarkdownIt
}
