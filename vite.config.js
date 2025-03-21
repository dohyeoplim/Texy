import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: "/Texy/",
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    worker: {
        format: "es",
    },
    build: {
        target: "es2015",
        outDir: "dist",
        assetsDir: "assets",
    },
    server: {
        port: 8080,
    },
});
