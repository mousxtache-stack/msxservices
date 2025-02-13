import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Si tu veux utiliser HTTPS, garde cette partie, sinon, tu peux la supprimer
    https: {
      key: fs.readFileSync("localhost-key.pem"), // ton fichier clé privée
      cert: fs.readFileSync("localhost-cert.pem"), // ton fichier certificat
    },
    // Ou si tu veux plutôt utiliser cette configuration pour HTTP
    host: "::",
    port: 8080,
    allowedHosts: [
      "localhost",
      "*.lovableproject.com",
      "*.lovable.app"
    ]
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
