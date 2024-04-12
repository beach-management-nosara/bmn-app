import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import type { Property } from "@/types/property";

const DEV = import.meta.env.DEV;
const BASE_URL = DEV ? "http://localhost:4321" : import.meta.env.SITE;

export function useProperties() {
    const URL = BASE_URL + "/api/properties.json";
    const { data, error, isLoading } = useSWR<Property[]>(URL, fetcher);

    const propertiesSimple = data?.map(p => ({ id: p.id, name: p.name })) || [];

    return {
        properties: data,
        propertiesSimple,
        error,
        isLoading
    };
}
