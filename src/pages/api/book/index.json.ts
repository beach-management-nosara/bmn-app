import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const requestBody = await request.json();

    const { name, email, roomTypeId, guests, propertyId, periodStart, periodEnd } = requestBody;

    if (periodStart == null || periodEnd == null) {
        throw new Error("Invalid date range");
    }

    try {
        const response = await fetch("https://api.lodgify.com/v1/reservation/booking", {
            method: "POST",
            headers: {
                "X-ApiKey": import.meta.env.API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                guest: { name: name, email: email },
                rooms: [{ room_type_id: roomTypeId, people: guests }],
                property_id: propertyId,
                arrival: periodStart,
                departure: periodEnd,
                bookability: "BookingRequest",
                status: "Open"
            })
        });

        const parsedResponse = (await response.json()) as { message: string };

        if (!response.ok || !parsedResponse) {
            return new Response(JSON.stringify({ error: parsedResponse.message }), { status: 400 });
        }

        const quoteResponse = await fetch(
            `https://api.lodgify.com/v1/reservation/booking/${parsedResponse}/quote`,
            {
                method: "POST",
                headers: {
                    "X-ApiKey": import.meta.env.API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    room_types: [{ room_type_id: 408240 }],
                    is_policy_active: true
                })
            }
        );
        const quoteId = await quoteResponse.json();

        return new Response(JSON.stringify({ data: quoteId }), { status: 200 });
    } catch (error) {
        console.error("Failed to fetch availability:", error);

        return new Response(JSON.stringify({ error }), { status: 400 });
    }
};
