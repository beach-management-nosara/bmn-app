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

    const idList = [
        368123, // Tres Hermanas, Luxury home
        280439, // Nai'a Luxury Vacation House
        277894, // Shanta Pura
        439129, // Casa Los Pochotes, Luxury Vacation Home (New Listing)
        466024, // Terrace House, Luxury Vacation Home (New Listing)
        279982, // Almendra
        481099, // Calma House, Luxury Vacation Home (New Listing)
        483495, // Utopia Escapista
        576665, // Free Spirits House
        530996, // Ansui House, Vacation Home
        282029, // Villa Belitza
        277622, // Hermandad
        530060, // Last PC Luxury Vacation Home
        482720, // Verano Eterno
        277603, // FLOW Main House
        277588, // FLOW Casita
        277895, // FLOW - Villa O, Vacation Home
        277594, // FLOW - Villa W, Vacation Home
        292658, // FLOW 4 Villas, Luxury Vacation Homes
        292644, // FLOW MainHouse + Casita
        288487, // El NIDO 4 Bedroom, 4 Bathroom Luxury House
        570825, // Villa Paz Shalom
        277892, // Casa Sierra
        351551, // Ashaya, Luxury Vacation Home
        277727, // Robins Nest 3 Bedroom, 2 Bathroom Oasis
        342716, // Alma del Mar
        334483, // Casa Catalina, Vacation Home
        531664, // JOYA: A Modern Jungle Getaway near the Beach
        531672, // Casita IVY
        539969, // Calmate
        277581, // Casa Paco Main House, long term rental available
        343324 // Paco Studio
    ];

    // Create a map of ID to index in the idList
    const idIndexMap: { [id: number]: number } = {};
    idList.forEach((id, index) => {
        idIndexMap[id] = index;
    });

    const properties = data?.items.sort((a, b) => {
        const indexA = idIndexMap[a.id];
        const indexB = idIndexMap[b.id];

        // If either ID is not found in the idList, place it at the end
        if (indexA === undefined && indexB === undefined) {
            return 0; // Maintain original order for both items
        } else if (indexA === undefined) {
            return 1; // a is considered greater (placed after b)
        } else if (indexB === undefined) {
            return -1; // b is considered greater (placed after a)
        }

        // Both IDs are found in the idList, sort based on their indices
        return indexA - indexB;
    });

    return new Response(
        JSON.stringify({ properties: properties, count: data.count, success: true }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json"
                // Set Cache-Control to public and cache for a day
                // "Cache-Control": "public, max-age=86400, s-maxage=86400"
            }
        }
    );
};
