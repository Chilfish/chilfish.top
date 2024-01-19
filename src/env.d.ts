/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GITHUB_TOKEN: string
  readonly NCM_UID: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
