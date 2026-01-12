import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Konfiguracja __dirname dla modułów ES (Node.js w trybie module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  // 1. Czyste pluginy bez dziwactw z Replita
  plugins: [react()],

  // 2. Aliasy ścieżek
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },

  // 3. Wskazujemy, że plik index.html znajduje się w folderze client
  root: path.resolve(__dirname, "client"),

  // 4. Konfiguracja builda
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },

  // 5. Konfiguracja serwera pod Dockera
  server: {
    host: "0.0.0.0", // Pozwala na dostęp z zewnątrz kontenera (z Windowsa)
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // KLUCZOWE DLA WINDOWSA: Wymusza śledzenie zmian w plikach
    },
  },
});