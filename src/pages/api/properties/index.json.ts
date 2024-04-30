import type { APIRoute } from "astro";

import type { Property } from "@/types/property";

export const prerender = false;
const API_KEY = import.meta.env.API_KEY;

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);

    const q = new URLSearchParams(url.search);
    const page = q.get("page");
    const size = q.get("size");

    const response = await fetch(
        `https://api.lodgify.com/v2/properties?includeCount=true&page=${page ?? 1}${size ? `&size=${size}` : ""}`,
        {
            method: "GET",
            headers: {
                "X-ApiKey": API_KEY,
                "Content-Type": "application/json"
            }
        }
    );

    if (!response.ok) {
        return new Response(JSON.stringify({ success: false, message: "An error occurred" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    const data = (await response.json()) as { items: Property[]; count: number };

    const properties = data?.items.sort((a, b) => a.name.localeCompare(b.name));

    return new Response(JSON.stringify({ properties, count: data.count, success: true }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
            // Set Cache-Control to public and cache for a day
            // "Cache-Control": "public, max-age=86400, s-maxage=86400"
        }
    });
};
