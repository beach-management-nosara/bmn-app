import { useEffect, useState } from "react";

import { useProperties } from "@/hooks/useProperties";
import { PropertiesList } from "./properties-list";
import type { Property } from "@/types/property";

export const PropertiesFiltered = () => {
    const { properties, isLoading, success } = useProperties();
    const [selectedProperties, setSelectedProperties] = useState<Property[]>();

    // Don't remove, so we can easily add it back
    // const totalPages = selectedProperties?.length != 10 ? 1 : Math.ceil((count ?? 0) / PAGE_SIZE);

    useEffect(() => {
        if (success && properties) {
            setSelectedProperties(properties);
        }
    }, [success, properties]);

    return (
        <div className="mx-auto h-full max-w-screen-2xl py-16 overflow-x-hidden px-5 lg:overflow-x-visible">
            <PropertiesList
                selectedProperties={selectedProperties}
                isLoading={isLoading}
                success={success}
            />
        </div>
    );
};
