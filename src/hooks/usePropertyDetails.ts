import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import type { PropertyData } from "@/types";

const DEV = import.meta.env.DEV;
const BASE_URL = DEV ? "http://localhost:4321" : import.meta.env.SITE;

type PropertyDetailsResponse = {
    success: boolean;
    message?: string;
    rooms: PropertyData;
    property: {
        city: string;
        state: string;
        country: string;
        rating: number;
        currency_code: string;
    };
};

export function usePropertyDetails(slug: string) {
    const URL = BASE_URL + `/api/properties/${slug}.json`;
    const { data, error, isLoading } = useSWR<PropertyDetailsResponse>(
        () => (slug ? URL : null), // Only fetch if slug is provided
        fetcher
    );

    return {
        property: data?.property,
        room: data?.rooms,
        success: data?.success,
        error,
        isLoading
    };
}
