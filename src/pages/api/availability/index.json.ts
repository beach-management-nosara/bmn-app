import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);

    const q = new URLSearchParams(url.search);
    const periodStart = q.get("periodStart");
    const periodEnd = q.get("periodEnd");

    if (periodStart == null || periodEnd == null) {
        throw new Error("Invalid date range");
    }

    const response = await fetch(
        `https://api.lodgify.com/v2/availability?start=${encodeURIComponent(periodStart)}&end=${encodeURIComponent(periodEnd)}`,
        {
            method: "GET",
            headers: {
                "X-ApiKey": import.meta.env.API_KEY,
                "Content-Type": "application/json"
            }
        }
    );

    const properties = (await response.json()) as {
        property_id: number;
        periods: { available: 1 | 0 }[];
    }[];

    const availableProperties = properties.filter(property => {
        return property.periods.every(period => period.available === 1);
    });

    if (!response.ok) {
        throw new Error("Network response was not ok on availability");
    }

    // Extract IDs of available properties
    const availablePropertyIds = availableProperties.map(property => property.property_id);

    return new Response(JSON.stringify({ data: availablePropertyIds, success: true }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
            // Set Cache-Control to public and cache for a day
            // "Cache-Control": "public, max-age=86400, s-maxage=86400"
        }
    });
};
