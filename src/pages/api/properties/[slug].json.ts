import type { APIRoute } from "astro";

import type { PropertyData, Rate } from "@/types";
import { formatToApiDate } from "@/lib/utils";

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

export const GET: APIRoute = async ({ params, request }) => {
    if (!params.slug) return errorResponse("No slug provided");

    const url = new URL(request.url);

    const q = new URLSearchParams(url.search);
    const periodStart = q.get("startDate");
    const periodEnd = q.get("endDate");

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

    // Fetch rates data
    const now = new Date();
    const startDate = periodStart ? new Date(periodStart) : now;
    const endDate = periodEnd ? new Date(periodEnd) : now;

    const ratesRes = await fetch(
        BASE_URL +
            `/v1/rates/calendar?RoomTypeId=${rooms?.id}&HouseId=${params.slug}` +
            (startDate ? `&startDate=${encodeURIComponent(formatToApiDate(startDate))}` : "") +
            (endDate ? `&endDate=${encodeURIComponent(formatToApiDate(endDate))}` : ""),
        {
            method: "GET",
            headers: {
                "X-ApiKey": API_KEY,
                "Content-Type": "application/json"
            }
        }
    );

    if (!ratesRes.ok) return errorResponse("An error occurred");
    const rates = (await ratesRes.json()) as Rate[];

    const maxMinStay = rates.reduce((maxStay, rate) => {
        const maxRateStay = rate.prices.reduce((max, price) => Math.max(max, price.min_stay), 0);
        return Math.max(maxStay, maxRateStay);
    }, 0);

    const rate = rates.reduce((total, datePrices) => {
        const prices7days = datePrices.prices.filter(price => price.min_stay === 7);

        const prices = prices7days.length > 0 ? prices7days : datePrices.prices;

        const dayRate = prices.reduce((dayTotal, price) => {
            if (price.min_stay === 7) {
                return (dayTotal += price.price_per_day);
            } else {
                return (dayTotal += price.price_per_day);
            }
        }, 0);
        return total + dayRate;
    }, 0);

    return new Response(
        JSON.stringify({
            success: true,
            rooms,
            property,
            rate: { price: rates.length === 1 ? rate * 7 : rate, min_stay: maxMinStay }
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};
