import type { Property } from "@/types/property";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
    const BASE_URL = import.meta.env.SITE;
    const API_KEY = import.meta.env.API_KEY;

    const response = await fetch("https://api.lodgify.com/v1/properties", {
        method: "GET",
        headers: {
            "X-ApiKey": API_KEY,
            "Content-Type": "application/json"
        }
    });
    const properties = await response.json();

    // Generate Sitemap
    const staticRoutes = ["/", "/checkout/", "/contact/", "/experiences/", "/homes/", "/services/"];
    const dynamicRoutes = properties.map((p: Property) => `/homes/${p.id}/`);

    const urls = [...staticRoutes, ...dynamicRoutes]
        .map(route => `<url><loc>${BASE_URL + route}</loc></url>`)
        .join("");

    const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${urls}
        </urlset>
    `.trim();

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml"
        }
    });
};
