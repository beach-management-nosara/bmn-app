import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
    // site: "https://bmn-dev.netlify.app", -> for dev site
    site: "https://beachmanagementnosara.com",
    integrations: [
        tailwind({
            applyBaseStyles: false
        }),
        react(),
        partytown()
    ],
    output: "hybrid",
    adapter: netlify(),
    prefetch: true
});
