import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Standalone test config: the app's vite.config.ts pulls in Tailwind, React and
// WASM/worker plugins that pure-logic tests do not need. We only need the `@/`
// alias to resolve, which vite-tsconfig-paths provides from tsconfig.json.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
