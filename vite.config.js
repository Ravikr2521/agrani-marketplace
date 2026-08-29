import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(process.cwd(), "./src") } },
  server: {
    allowedHosts: ["9083-103-243-63-203.ngrok-free.app"],
  },
});
