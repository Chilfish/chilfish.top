/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GITHUB_TOKEN: string
  readonly NCM_UID: number
  readonly NCM_API: string
  readonly NCM_COOKIE: string
  readonly RESUME_INFO: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
