import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://ray0211.me',
  base: '/my-blog',
  
  vite: {
    plugins: [tailwindcss()],
  },
  
  markdown: {
    shikiConfig: {
      theme: 'dark-plus',
      wrap: true,
    },
  },
});