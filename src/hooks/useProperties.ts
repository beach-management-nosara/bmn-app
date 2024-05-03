import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
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

    const propertiesSimple =
        data?.properties.map(p => ({ id: p.id, name: p.name, image: `https:${p.image_url}` })) ||
        [];

    return {
        properties: data?.properties,
        count: data?.count,
        propertiesSimple,
        success: data?.success,
        error,
        isLoading
    };
}
