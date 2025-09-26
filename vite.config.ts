import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import topLevelAwait from 'vite-plugin-top-level-await';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss(), tsconfigPaths() , topLevelAwait()],
  server : { 
    port : 3000
  } , 
  optimizeDeps: {
    // Don't optimize these packages as they contain web workers and WASM files.
    // https://github.com/vitejs/vite/issues/11672#issuecomment-1415820673
    exclude: ['@journeyapps/wa-sqlite', '@powersync/web'],
    include: ['@powersync/web > js-logger']
  },
  worker: {
    format: 'es',
    plugins: () => [ topLevelAwait()]
  }
})
