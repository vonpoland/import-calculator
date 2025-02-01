import { defineConfig } from "vitest/config";

import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  plugins: [react()],
});
