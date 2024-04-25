import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
    const url = new URL(request.url);

    const q = new URLSearchParams(url.search);
    const periodStart = q.get("periodStart");
    const periodEnd = q.get("periodEnd");

    if (periodStart == null || periodEnd == null) {
        throw new Error("Invalid date range");
    }

    try {
        const response = await fetch(
            `https://api.lodgify.com/v2/availability/${params.propertyId}?start=${encodeURIComponent(periodStart)}&end=${encodeURIComponent(periodEnd)}&includeDetails=false`,

            {
                method: "GET",
                headers: {
                    "X-ApiKey": import.meta.env.API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        const availabilityData = await response.json();

        return new Response(
            JSON.stringify({
                data: availabilityData
            }),
            {
                status: 200
            }
        );
    } catch (error) {
        console.error("Failed to fetch availability:", error);

        return new Response(
            JSON.stringify({
                error
            }),
            {
                status: 400
            }
        );
    }
};
