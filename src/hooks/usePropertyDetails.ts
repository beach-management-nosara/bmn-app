import useSWR from "swr";
import { useMemo } from "react";
import { fetcher } from "@/lib/fetcher";
import type { PropertyData } from "@/types";
import { formatToApiDate } from "@/lib/utils";

const DEV = import.meta.env.DEV;
const BASE_URL = DEV ? "http://localhost:4321" : import.meta.env.SITE;

type PropertyDetailsResponse = {
    success: boolean;
    message?: string;
    rooms: PropertyData;
    property: {
        id: string;
        name: string;
        address: string;
        city: string;
        state: string;
        country: string;
        rating: number;
        currency_code: string;
        agreement_text: string;
        image_url: string;
    };
    rate: {
        price: number;
        min_stay: number;
    };
};

export function usePropertyDetails(slug: string, startDate?: Date, endDate?: Date) {
    const URL = useMemo(
        () =>
            BASE_URL +
            `/api/properties/${slug}.json?` +
            (startDate && endDate
                ? `startDate=${encodeURIComponent(formatToApiDate(startDate))}&endDate=${encodeURIComponent(formatToApiDate(endDate))}`
                : ""),
        [slug, startDate, endDate]
    );

    const { data, error, isLoading } = useSWR<PropertyDetailsResponse>(
        () => (slug ? URL : null), // Only fetch if slug is provided
        fetcher
    );

    return {
        property: data?.property,
        room: data?.rooms,
        rate: data?.rate,
        success: data?.success,
        error,
        isLoading
    };
}
