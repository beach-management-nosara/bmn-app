import { BathIcon, BedIcon, MapPinIcon, StarIcon, UsersIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { usePropertyDetails } from "@/hooks/usePropertyDetails";
import type { PropertyData } from "@/types";
import { PropertyDetailsTabs } from "./property-tabs";
import Reviews from "./reviews";

interface PropertyDetailsProps {
    slug: string;
}

export function PropertyDetails({ slug }: PropertyDetailsProps) {
    const { property, room, isLoading } = usePropertyDetails(slug);

    return (
        <div className="p-4 py-12 md:col-span-2">
            <div>
                {isLoading ? (
                    <Skeleton className="mb-3 h-[68px] w-full bg-gray-200" />
                ) : (
                    <h1 className="text-balance text-5xl font-bold text-secondary">{room?.name}</h1>
                )}
            </div>

            <div className="flex items-center gap-2 pb-4">
                <MapPinIcon size={16} className="text-muted" />
                {isLoading ? (
                    <Skeleton className="h-5 w-40 bg-gray-200" />
                ) : (
                    <span className="uppercase text-muted">
                        {property?.city}, {property?.state}, {property?.country}
                    </span>
                )}
            </div>

            <div className="h-1 w-full border-t border-gray-300"></div>

            <div className="my-4 flex flex-col text-secondary md:flex-row md:justify-between">
                <div className="flex flex-col gap-2 md:flex-row">
                    <div className="flex items-center gap-2">
                        <UsersIcon size={16} className="text-muted" />
                        Guests:{" "}
                        {isLoading ? (
                            <Skeleton className="size-4 bg-gray-200" />
                        ) : (
                            <span>{room?.max_people}</span>
                        )}
                    </div>
                    <span className="hidden md:inline">•</span>

                    <div className="flex items-center gap-2">
                        <BedIcon size={16} className="text-muted" />
                        Bedrooms:{" "}
                        {isLoading ? (
                            <Skeleton className="size-4 bg-gray-200" />
                        ) : (
                            <span>{room?.bedrooms}</span>
                        )}
                    </div>
                    <span className="hidden md:inline">•</span>

                    <div className="flex items-center gap-2">
                        <BathIcon size={16} className="text-muted" />
                        Bathrooms:{" "}
                        {isLoading ? (
                            <Skeleton className="size-4 bg-gray-200" />
                        ) : (
                            <span>{room?.bathrooms}</span>
                        )}
                    </div>
                </div>
                <div className="mt-2 flex items-center gap-2 font-bold md:mt-0">
                    <span>Rating: </span>
                    <StarIcon size={16} className="text-primary" />
                    {isLoading ? (
                        <Skeleton className="size-4 bg-gray-200" />
                    ) : (
                        <span>{property?.rating ?? "Not rated yet"}</span>
                    )}
                </div>
            </div>

            <div className="h-1 w-full border-t border-gray-300"></div>

            {room && <PropertyDetailsTabs data={room as PropertyData} />}

            <Reviews propertyId={slug} />
        </div>
    );
}
