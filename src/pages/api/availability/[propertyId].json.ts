import type { APIRoute } from "astro";

export const prerender = false;

type Period = {
    start: string;
    end: string;
    available: number; // 0 = not available, 1 = available
};

function adjustAvailabilityPeriods(periods: Period[]) {
    return periods.map(period => {
        let adjustedPeriod = { ...period };

        // Get start and end dates as Date objects
        const adjustedStart = new Date(adjustedPeriod.start);
        const adjustedEnd = new Date(adjustedPeriod.end);

        // If the period is available
        if (adjustedPeriod.available === 1) {
            // Adjust the end date to allow checkout on the last day
            adjustedEnd.setDate(adjustedEnd.getDate() + 1); // Adjust the end date to be one day before for availability purposes
            adjustedPeriod.end = adjustedEnd.toISOString().split("T")[0]; // Convert back to yyyy-mm-dd
        }

        // If the period is unavailable but should allow check-ins on the first day
        if (adjustedPeriod.available === 0) {
            // Adjust the start date to allow check-in on the start day
            adjustedStart.setDate(adjustedStart.getDate() + 1); // Move start date forward to allow check-ins on that day
            adjustedPeriod.start = adjustedStart.toISOString().split("T")[0]; // Convert back to yyyy-mm-dd

            // Don't make the whole period available, just adjust the start
            adjustedPeriod.available = 0; // Keep it unavailable except for the start day
        }

        return adjustedPeriod;
    });
}

export const GET: APIRoute = async ({ params, request }) => {
    console.log("🚀 ~ constGET:APIRoute= ~ params:", params);
    const url = new URL(request.url);

    const q = new URLSearchParams(url.search);
    const periodStart = q.get("periodStart");
    const periodEnd = q.get("periodEnd");

    if (!params.propertyId) {
        throw new Error("No property id provided");
    }

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

        let availabilityData = await response.json();
        const modifiedPeriods = adjustAvailabilityPeriods(availabilityData[0]?.periods);
        availabilityData[0].periods = modifiedPeriods;

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
