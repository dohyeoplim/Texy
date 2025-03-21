import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    worker: {
        format: "es",
    },
    optimizeDeps: {
        exclude: ["comlink"],
    },
    build: {
        target: "esnext",
        outDir: "dist",
        assetsDir: "assets",
        sourcemap: true,
    },
    server: {
        port: 5000,
        open: true,
        cors: true,
    },
});
