/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYPAL_CLIENT_ID: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_STRIPE_SUCCESS_PATH: string;
  readonly VITE_STRIPE_CANCEL_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
