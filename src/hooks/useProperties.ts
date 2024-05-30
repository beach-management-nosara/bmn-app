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

type PropertySimple = {
    id: number;
    name: string;
    image: string;
};

function mapOrder(array: PropertySimple[], order: number[]): PropertySimple[] {
    const orderMap = new Map(order.map((id, index) => [id, index]));
    return array
        .slice()
        .sort((a, b) => (orderMap.get(a.id) ?? Infinity) - (orderMap.get(b.id) ?? Infinity));
}

export function useProperties({ page, size }: { page: number; size?: number } = { page: 1 }) {
    const URL = BASE_URL + `/api/properties.json?page=${page}${size ? `&size=${size}` : ""}`;
    const { data, error, isLoading } = useSWR<PropertiesResponse>(URL, fetcher);

    const propertiesSimple = useMemo(
        () =>
            mapOrder(
                data?.properties.map(p => ({
                    id: p.id,
                    name: p.name,
                    image: `https:${p.image_url}`
                })) || [],
                idsInOrder
            ),
        [data]
    );

    return {
        properties: data?.properties,
        count: data?.count,
        propertiesSimple,
        success: data?.success,
        error,
        isLoading
    };
}
