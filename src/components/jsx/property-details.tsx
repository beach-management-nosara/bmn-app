import { BathIcon, BedIcon, MapPinIcon, StarIcon, UsersIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { usePropertyDetails } from "@/hooks/usePropertyDetails";
import type { PropertyData } from "@/types";
import { PropertyDetailsTabs } from './property-tabs';


interface PropertyDetailsProps {
    slug: string;
}

export function PropertyDetails({ slug }: PropertyDetailsProps) {
    const { property, room, isLoading } = usePropertyDetails(slug);

    return (
        <div className="p-4 py-12 md:col-span-2">
            <div>
                {isLoading ? (
                    <Skeleton className="w-full mb-3 h-[68px] bg-gray-200" />
                ) : (
                    <h1 className="text-balance text-5xl font-bold text-secondary">{room?.name}</h1>
                )}
            </div>

            <div className="flex items-center gap-2 pb-4">
                <MapPinIcon size={16} className="text-muted" />
                {isLoading ? (
                    <Skeleton className="w-40 h-5 bg-gray-200" />
                ) : (
                    <span className="uppercase text-muted">
                        {property?.city}, {property?.state}, {property?.country}
                    </span>
                )}
            </div>

            <div className="h-1 w-full border-t border-gray-300"></div>

            <div className="my-4 flex flex-col text-secondary md:flex-row md:justify-between">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center gap-2">
                        <UsersIcon size={16} className="text-muted" />
                        Guests: {isLoading ? <Skeleton className="size-4 bg-gray-200" /> : <span>{room?.max_people}</span>}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                        <BedIcon size={16} className="text-muted" />
                        Bedrooms: {isLoading ? <Skeleton className="size-4 bg-gray-200" /> : <span>{room?.bedrooms}</span>}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                        <BathIcon size={16} className="text-muted" />
                        Bathrooms: {isLoading ? <Skeleton className="size-4 bg-gray-200" /> : <span>{room?.bathrooms}</span>}
                    </div>
                </div>
                <div className="flex items-center gap-2 font-bold">
                    <span>Rating: </span>
                    <StarIcon size={16} className="text-primary" />
                    {isLoading ? <Skeleton className="size-4 bg-gray-200" /> : <span>{property?.rating ?? "Not rated yet"}</span>}
                </div>
            </div>

            <div className="h-1 w-full border-t border-gray-300"></div>

            {room && <PropertyDetailsTabs data={room as PropertyData} />}
        </div>
    )
}