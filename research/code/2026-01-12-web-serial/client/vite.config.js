import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
  build: {
    outDir: "../server/dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        remote: resolve(__dirname, "remote.html"),
        llm: resolve(__dirname, "llm.html"),
      },
    },
  },
});
