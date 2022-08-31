/// <reference types="vitest" />
/// <reference types="vite/client" />
// react with vitest: https://www.eternaldev.com/blog/testing-a-react-application-with-vitest/

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "node-fetch": "isomorphic-fetch",
      "stream": "stream-browserify",
      "util": "util"
    },
  },
});
