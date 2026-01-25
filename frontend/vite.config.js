import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // API requests ko backend par bhejo
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      // Images (Uploads) ko backend par bhejo
      "/uploads": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
