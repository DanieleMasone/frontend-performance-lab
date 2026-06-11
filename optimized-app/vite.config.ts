import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/frontend-performance-lab/optimized/" : "/",
  cacheDir: "../.vite/optimized-app",
  optimizeDeps: {
    noDiscovery: true,
    include: []
  },
  build: {
    outDir: "../site/optimized",
    emptyOutDir: true,
    sourcemap: true
  },
  server: {
    port: 5174,
    strictPort: false
  }
}));
