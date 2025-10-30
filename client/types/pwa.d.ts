declare module 'virtual:pwa-register' {
  // Minimal declaration to satisfy TypeScript when vite-plugin-pwa is present
  export function registerSW(options?: any): () => Promise<void>;
}
