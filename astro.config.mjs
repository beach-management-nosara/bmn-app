import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: 'https://beach-management-nosara.netlify.app',
  integrations: [tailwind({
    applyBaseStyles: false
  }), react(), sitemap(), robotsTxt()],
  output: "hybrid",
  adapter: netlify()
});