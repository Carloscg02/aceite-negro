/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_LINK_CAJA_6?: string;
  readonly VITE_STRIPE_LINK_CAJA_12?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
