import type { APIRoute } from "astro";

import type { PropertyData } from "@/types";

export const prerender = false;
const API_KEY = import.meta.env.API_KEY;
const BASE_URL = import.meta.env.API_BASE_URL;

function errorResponse(message: string) {
    return new Response(JSON.stringify({ success: false, message }), {
        status: 500,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const GET: APIRoute = async ({ params }) => {
    if (!params.slug) return errorResponse("No slug provided");

    const roomsRes = await fetch(BASE_URL + "/v2/properties/" + params.slug + "/rooms", {
        method: "GET",
        headers: {
            "X-ApiKey": API_KEY,
            "Content-Type": "application/json"
        }
    });

    if (!roomsRes.ok) return errorResponse("An error occurred");
    const roomsJSON = (await roomsRes.json()) as PropertyData[];
    const rooms = roomsJSON?.at(0);

    // Fetch property data
    const PROPERTY_URL = BASE_URL + "/v2/properties/" + params.slug;
    const propertyResponse = await fetch(PROPERTY_URL, {
        method: "GET",
        headers: {
            "X-ApiKey": API_KEY,
            "Content-Type": "application/json"
        }
    });

    if (!propertyResponse.ok) return errorResponse("An error occurred");

    const property = (await propertyResponse.json()) as {
        city: string;
        state: string;
        country: string;
        rating: number;
        currency_code: string;
    };

    return new Response(JSON.stringify({ success: true, rooms, property }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
};
