import useSWR from "swr";
import { useMemo } from "react";

import { fetcher } from "@/lib/fetcher";
import { idToPrice } from "./priceData";
import type { Property } from "@/types/property";

const DEV = import.meta.env.DEV;
const BASE_URL = DEV ? "http://localhost:4321" : import.meta.env.SITE;

type PropertiesResponse = {
    properties: Property[];
    count: number;
    message?: string;
    success: boolean;
};

export function useProperties({ page, size }: { page: number; size?: number } = { page: 1 }) {
    const URL = BASE_URL + `/api/properties.json?page=${page}${size ? `&size=${size}` : ""}`;
    const { data, error, isLoading } = useSWR<PropertiesResponse>(URL, fetcher);

    const propertiesSimple = useMemo(
        () =>
            data?.properties.map(p => ({
                id: p.id,
                name: p.name,
                image: `https:${p.image_url}`
            })) || [],
        [data]
    );

    const priceMap = useMemo(
        () => new Map(idToPrice.map(item => [item.id, item.min_price])),
        [idToPrice]
    );

    const updatedProperties = useMemo(
        () =>
            data?.properties.map(property => ({
                ...property,
                min_price: priceMap.get(property.id) || property.min_price // Use existing min_price if no update is found
            })),
        [data, priceMap]
    );

    return {
        properties: updatedProperties,
        count: data?.count,
        propertiesSimple,
        success: data?.success,
        error,
        isLoading
    };
}
