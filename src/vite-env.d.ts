/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Canonical production URL, injected at build time (see vite.config.ts). */
  readonly VITE_SITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
