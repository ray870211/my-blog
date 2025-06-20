import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://ray-blog.vercel.app/', // 更新為您的實際域名
  
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