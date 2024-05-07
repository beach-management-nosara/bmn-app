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
        368123, 280439, 277894, 439129, 466024, 279982, 481099, 483495, 576665, 530996, 282029,
        277622, 530060, 482720, 277581, 277588, 277603, 277594, 292658, 292644, 288487, 570825,
        277892, 351551, 277727, 342716, 334483, 531664, 531672, 539969, 277895, 343324
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
