import useSWR from "swr";
import { useMemo } from "react";

import { fetcher } from "@/lib/fetcher";
import type { Property } from "@/types/property";
import { idsInOrder } from "./idOrderArray";

const DEV = import.meta.env.DEV;
const BASE_URL = DEV ? "http://localhost:4321" : import.meta.env.SITE;

type PropertiesResponse = {
    properties: Property[];
    count: number;
    message?: string;
    success: boolean;
};

function mapOrder<T extends { id: number }>(array: T[], order: number[]): T[] {
    const orderMap = new Map(order.map((id, index) => [id, index]));
    return array
        .slice()
        .sort((a, b) => (orderMap.get(a.id) ?? Infinity) - (orderMap.get(b.id) ?? Infinity));
}

export function useProperties({ page, size }: { page: number; size?: number } = { page: 1 }) {
    const URL = BASE_URL + `/api/properties.json?page=${page}${size ? `&size=${size}` : ""}`;
    const { data, error, isLoading } = useSWR<PropertiesResponse>(URL, fetcher);

    const orderedProperties = useMemo(() => mapOrder(data?.properties || [], idsInOrder), [data]);

    const propertiesSimple = useMemo(
        () =>
            orderedProperties.map(p => ({
                id: p.id,
                name: p.name,
                image: `https:${p.image_url}`
            })),
        [orderedProperties]
    );

    return {
        properties: orderedProperties,
        count: data?.count,
        propertiesSimple,
        success: data?.success,
        error,
        isLoading
    };
}
