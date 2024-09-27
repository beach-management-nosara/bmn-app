import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);

    const q = new URLSearchParams(url.search);
    let periodStart = q.get("periodStart");
    let periodEnd = q.get("periodEnd");

    if (periodStart == null || periodEnd == null) {
        throw new Error("Invalid date range");
    }

    // Remove the time component to work only with dates
    periodStart = periodStart.split(" ")[0];
    periodEnd = periodEnd.split(" ")[0];

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

    const userPeriodStart = new Date(`${periodStart}T00:00:00Z`);
    const userPeriodEnd = new Date(`${periodEnd}T00:00:00Z`);

    const availableProperties = properties.filter(property => {
        // Check if there are valid periods for check-in and check-out on the selected range
        const validPeriods = property.periods.filter(period => {
            const periodStart = new Date(`${period.start}T00:00:00Z`);
            const periodEnd = new Date(`${period.end}T00:00:00Z`);

            // Allow check-out on the start date (first day of booking)
            const startDateAvailable =
                (periodStart.getTime() === userPeriodStart.getTime() && period.available === 1) ||
                periodStart.getTime() === userPeriodEnd.getTime();

            // Allow check-in on the end date (last day of booking)
            const endDateAvailable =
                (periodEnd.getTime() === userPeriodEnd.getTime() && period.available === 1) ||
                periodEnd.getTime() === userPeriodStart.getTime();

            // Block all other days between start and end dates
            const isBlocked =
                periodStart > userPeriodStart &&
                periodEnd < userPeriodEnd &&
                period.available === 0;

            return (startDateAvailable || endDateAvailable) && !isBlocked;
        });

        return validPeriods.length > 0;
    });

    const availablePropertyIds = availableProperties.map(property => property.property_id);

    return new Response(JSON.stringify({ data: availablePropertyIds, success: true }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
};
