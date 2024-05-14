import useSWR from "swr";
import { useMemo } from "react";
import { fetcher } from "@/lib/fetcher";
import type { PropertyData } from "@/types";
import { idToPrice } from "./priceData";

const DEV = import.meta.env.DEV;
const BASE_URL = DEV ? "http://localhost:4321" : import.meta.env.SITE;

type PropertyDetailsResponse = {
    success: boolean;
    message?: string;
    rooms: PropertyData;
    property: {
        id: string;
        city: string;
        state: string;
        country: string;
        rating: number;
        currency_code: string;
    };
};

export function usePropertyDetails(slug: string) {
    const URL = useMemo(() => BASE_URL + `/api/properties/${slug}.json`, [slug]);
    const { data, error, isLoading } = useSWR<PropertyDetailsResponse>(
        () => (slug ? URL : null), // Only fetch if slug is provided
        fetcher
    );

    const priceMap = useMemo(() => new Map(idToPrice.map(item => [item.id, item.min_price])), []);

    const updatedProperty = useMemo(
        () =>
            data?.property
                ? { ...data?.property, min_price: priceMap.get(parseInt(data.property.id, 10)) }
                : null,
        [data, priceMap]
    );

    return {
        property: updatedProperty,
        room: data?.rooms,
        success: data?.success,
        error,
        isLoading
    };
}
