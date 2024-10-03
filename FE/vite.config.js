import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/config/setup.js"],
    testMatch: ["./tests/*/.test.jsx$?"],
    globals: true,
    coverage: {
      exclude: [
        "src/App.jsx",
        "src/main.jsx",
        ".eslintrc.cjs",
        "*.config.js",
        "src/components/InteractiveMap.jsx",
      ],
    },
  },
  base: "/",
});
