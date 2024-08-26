import { useEffect, useState } from "react";

import { useProperties } from "@/hooks/useProperties";
import { SearchBox } from "./search-box";
import { PropertiesList } from "./properties-list";
import { heroHomesImg } from "@/assets/images";
import type { Property } from "@/types/property";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";


export const PropertiesFiltered = () => {
    const [page, setPage] = useState(1);
    const { properties, isLoading, success } = useProperties({ page });
    const [selectedProperties, setSelectedProperties] = useState<Property[]>();
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [propertyUnavailable, setPropertyUnavailable] = useState(false);

    // Don't remove, so we can easily add it back
    // const totalPages = selectedProperties?.length != 10 ? 1 : Math.ceil((count ?? 0) / PAGE_SIZE);
    const totalPages = 1

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {
        if (success && properties) {
            setSelectedProperties(properties);
        }
    }, [success, properties]);

    return (
        <div className="mx-auto h-full max-w-screen-2xl py-16 overflow-x-hidden px-5 lg:overflow-x-visible">
            <PropertiesList
                selectedProperties={selectedProperties}
                isLoading={isLoading || isSearchLoading}
                success={success}
            />
        </div>
    );
};
