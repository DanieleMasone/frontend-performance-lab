import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/frontend-performance-lab/slow/" : "/",
  cacheDir: "../.vite/slow-app",
  optimizeDeps: {
    noDiscovery: true,
    include: []
  },
  build: {
    outDir: "../site/slow",
    emptyOutDir: true,
    sourcemap: true
  },
  server: {
    port: 5173,
    strictPort: false
  }
}));
