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

    if (!response.ok) {
        throw new Error("Network response was not ok on availability");
    }

    const properties = (await response.json()) as {
        property_id: number;
        periods: { available: 1 | 0; start: string; end: string }[];
    }[];

    const userPeriodStart = new Date(periodStart);
    const userPeriodEnd = new Date(periodEnd);

    const availableProperties = properties.filter(property => {
        // Check if there are valid periods for check-in and check-out on the selected range
        const validPeriods = property.periods.filter(period => {
            const periodStart = new Date(period.start);
            const periodEnd = new Date(period.end);

            // Allow check-in on the start date and check-out on the end date
            const startDateAvailable =
                period.available === 1 || periodStart.getTime() === userPeriodStart.getTime();
            const endDateAvailable =
                period.available === 1 || periodEnd.getTime() === userPeriodEnd.getTime();

            // Include period if start and end dates match the user-selected range
            return (
                (startDateAvailable && periodEnd >= userPeriodStart) ||
                (endDateAvailable && periodStart <= userPeriodEnd)
            );
        });

        // If there are valid periods that cover the user's selected range, return true
        return validPeriods.length > 0;
    });

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
