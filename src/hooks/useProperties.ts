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

    const idToPrice = [
        { id: 277581, min_price: 685 },
        { id: 277588, min_price: 324 },
        { id: 277594, min_price: 180 },
        { id: 277603, min_price: 180 },
        { id: 277622, min_price: 601 },
        { id: 277727, min_price: 500 },
        { id: 277892, min_price: 550 },
        { id: 277894, min_price: 1000 },
        { id: 277895, min_price: 84 },
        { id: 279982, min_price: 1000 },
        { id: 280439, min_price: 1000 },
        { id: 282029, min_price: 721 },
        { id: 288487, min_price: 500 },
        { id: 292644, min_price: 706 },
        { id: 292658, min_price: 803 },
        { id: 334483, min_price: 500 },
        { id: 342716, min_price: 500 },
        { id: 343324, min_price: 56 },
        { id: 351551, min_price: 550 },
        { id: 368123, min_price: 2000 },
        { id: 439129, min_price: 2000 },
        { id: 466024, min_price: 1000 },
        { id: 481099, min_price: 1000 },
        { id: 482720, min_price: 950 },
        { id: 483495, min_price: 1000 },
        { id: 530060, min_price: 1000 },
        { id: 530996, min_price: 2000 },
        { id: 531664, min_price: 320 },
        { id: 531672, min_price: 205 },
        { id: 539969, min_price: 336 },
        { id: 570825, min_price: 1000 },
        { id: 576665, min_price: 550 }
    ];

    // Convert idToPrice to a Map for quick lookup
    const priceMap = new Map(idToPrice.map(item => [item.id, item.min_price]));

    // Direct mapping to update properties with min_price
    const updatedProperties = data?.properties.map(property => ({
        ...property,
        min_price: priceMap.get(property.id) || property.min_price // Use existing min_price if no update is found
    }));

    return {
        properties: updatedProperties,
        count: data?.count,
        propertiesSimple,
        success: data?.success,
        error,
        isLoading
    };
}
