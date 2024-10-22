import type { APIRoute } from "astro";

export const prerender = false;

type Period = {
    start: string;
    end: string;
    available: number; // 0 = not available, 1 = available
};

function isPeriodFullyAvailable(periods: Period[], startDate: string, endDate: string): boolean {
    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);

    // Loop through each day of the selected range
    for (let day = rangeStart; day <= rangeEnd; day.setDate(day.getDate() + 1)) {
        const formattedDay = day.toISOString().split("T")[0]; // yyyy-mm-dd

        // Find if there is any period covering this specific day
        const periodForDay = periods.find(period => {
            const periodStart = new Date(period.start);
            const periodEnd = new Date(period.end);
            return day >= periodStart && day <= periodEnd;
        });

        // If no period covers this day or it's unavailable, return false
        if (!periodForDay || periodForDay.available === 0) {
            return false;
        }
    }

    return true; // All days in the range are available
}

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

    // Ensure property is available for the entire selected range
    const availableProperties = properties.filter(property => {
        return isPeriodFullyAvailable(property.periods, periodStart, periodEnd);
    });

    const availablePropertyIds = availableProperties.map(property => property.property_id);

    return new Response(JSON.stringify({ data: availablePropertyIds, success: true }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
};
