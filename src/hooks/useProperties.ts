import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import type { Property } from "@/types/property";

const DEV = import.meta.env.DEV;
const BASE_URL = DEV ? "http://localhost:4321" : import.meta.env.SITE;

type PropertiesResponse = {
    properties: Property[];
    message?: string;
    success: boolean;
};

export function useProperties() {
    const URL = BASE_URL + "/api/properties.json";
    const { data, error, isLoading } = useSWR<PropertiesResponse>(URL, fetcher);

    const propertiesSimple = data?.properties.map(p => ({ id: p.id, name: p.name })) || [];

    return {
        properties: data?.properties,
        propertiesSimple,
        success: data?.success,
        error,
        isLoading
    };
}
