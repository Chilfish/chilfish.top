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
  import type { Plugin } from 'unified'

  const rehypeFigure: Plugin
  export default rehypeFigure
}
