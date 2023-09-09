import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth/login": {
        target: "https://auth-server-fmp.vercel.app",
        changeOrigin: true,
      },
      "/test": {
        target: "https://auth-server-fmp.vercel.app",
        changeOrigin: true,
      },
      "/auth/register": {
        target: "https://auth-server-fmp.vercel.app",
        changeOrigin: true,
      },
      "/auth/refresh-token": {
        target: "https://auth-server-fmp.vercel.app",
        changeOrigin: true,
      },
    },
  },
});
