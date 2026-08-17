import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


// Vite configuration
export default defineConfig({

  // Enable React support
  plugins: [react()],

  // Development server configuration
  server: {

    // Forward /api requests to Spring Boot
    proxy: {

      "/api": {

        // Spring Boot backend
        target: "http://localhost:8080",

        // Change the origin of the request
        changeOrigin: true,
        secure: false
      }
    }
  }
});