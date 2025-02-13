
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";



// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
<<<<<<< HEAD
    server: {
      https: {
        key: fs.readFileSync("localhost-key.pem"), // ton fichier clé privée
        cert: fs.readFileSync("localhost-cert.pem"), // ton fichier certificat
      },
    },
=======
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "localhost",
      "*.lovableproject.com",
      "*.lovable.app"
    ]
  },
>>>>>>> 2f797ec6778708bca0b2fdc2364c1818e8a3ace1
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
