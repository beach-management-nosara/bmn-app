import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import netlify from "@astrojs/netlify";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
    site: "https://beachmanagementnosara.com",
    // site: 'https://beach-management-nosara.netlify.app',
    integrations: [
        tailwind({
            applyBaseStyles: false
        }),
        react(),
        sitemap(),
        robotsTxt(),
        db()
    ],
    output: "hybrid",
    adapter: netlify(),
    prefetch: true
});
