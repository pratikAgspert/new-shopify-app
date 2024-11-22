import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(async () => {
  const shopify = (await import("vite-plugin-shopify")).default;

  return {
    plugins: [
      shopify({
        themeRoot: "extensions/test-vite-app",
      }),
      react(),
    ],
  };
});
