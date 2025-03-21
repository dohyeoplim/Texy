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
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                },
                chunkFileNames: "assets/js/[name]-[hash].js",
                entryFileNames: "assets/js/[name]-[hash].js",
                assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
            },
        },
    },
    server: {
        port: 5000,
        open: true,
        cors: true,
    },
});
