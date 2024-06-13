import type { QuoteData } from "@/types";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);

    const q = new URLSearchParams(url.search);
    const propertyId = q.get("propertyId");
    const arrival = q.get("arrival");
    const departure = q.get("departure");
    const roomId = q.get("roomId");
    const guests = q.get("guests");

    if (arrival == null || departure == null) {
        throw new Error("Invalid date range");
    }

    if (propertyId == null || roomId == null || guests == null) {
        throw new Error("Incomplete info");
    }

    const response = await fetch(
        `https://api.lodgify.com/v2/quote/${propertyId}?arrival=${encodeURIComponent(arrival)}&departure=${encodeURIComponent(departure)}&roomTypes[0].Id=${roomId}&roomTypes[0].People=${guests}`,
        {
            method: "GET",
            headers: {
                "X-ApiKey": import.meta.env.API_KEY,
                "Content-Type": "application/json"
            }
        }
    );

    if (!response.ok) {
        const res = await response.json();

        return new Response(JSON.stringify({ message: res.message, success: false }), {
            status: 400,
            headers: {
                "Content-Type": "application/json"
                // Set Cache-Control to public and cache for a day
                // "Cache-Control": "public, max-age=86400, s-maxage=86400"
            }
        });
    }

    const quoteData = (await response.json()) as QuoteData[];

    const quoteDataSimple = {
        total_scheduled_payments: quoteData[0].total_scheduled_payments,
        room_type: quoteData[0].room_types[0]
    };

    return new Response(JSON.stringify({ data: quoteDataSimple, success: true }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
            // Set Cache-Control to public and cache for a day
            // "Cache-Control": "public, max-age=86400, s-maxage=86400"
        }
    });
};
