import { useEffect, useState } from "react";
import { ChevronRightIcon, MapPinIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import type { Property } from "@/types/property";
import { cn, formatToApiDate } from "@/lib/utils";
import type { DateRange } from "@/types";
import { usePropertyDetails } from "@/hooks/usePropertyDetails";
import { PropertyRating } from "./property-rating";

export function PropertiesList({
    selectedProperties,
    isLoading,
    success
}: {
    selectedProperties?: Property[];
    isLoading: boolean;
    success?: boolean;
}) {
    return (
        <div className="mb-16 grid mx-auto grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:px-0">
            {isLoading && <CardSkeleton />}
            {success &&
                selectedProperties?.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))}
        </div>
    );
}

function PropertyCard({ property }: { property: Property }) {
    const { rate } = usePropertyDetails(property.id.toString());

    const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });
    const { id, image_url, name, address, currency_code, rating } = property;
    const imageUrl = "https:" + image_url;

    useEffect(() => {
        // Get the search parameters from the URL
        const searchParams = new URLSearchParams(window.location.search);
        const periodStartString = searchParams.get("periodStart");
        const periodEndString = searchParams.get("periodEnd");

        if (periodStartString && periodEndString) {
            // Convert the strings to Date objects
            const periodStartDate = periodStartString ? new Date(periodStartString) : undefined;
            const periodEndDate = periodEndString ? new Date(periodEndString) : undefined;

            setRange({ from: periodStartDate, to: periodEndDate });
        }
    }, []);

    return (
        <div className="relative mt-12 flex h-[500px] flex-col overflow-hidden rounded-lg bg-background shadow-lg">
            <div className="h-2/3 w-full overflow-hidden rounded-lg">
                <img
                    src={imageUrl}
                    alt={name}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover"
                />
                {/* Overlay from bottom to top */}
                <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-primary via-black/40 to-black/10"></div>

                {/* Card content */}
                <div
                    className={cn(
                        "absolute flex flex-col inset-x-0 bottom-0 top-1/2 z-10 rounded-lg p-4 text-white",
                        "bg-opacity-20 bg-clip-padding backdrop-blur-md backdrop-filter"
                    )}
                >
                    <PropertyRating rating={rating} />
                    <h3 className="text-balance text-base font-bold lg:text-2xl tracking-wide">{name}</h3>

                    <p className="flex items-center mt-2 gap-2">
                        <MapPinIcon className="text-white flex-shrink-0 size-4" />
                        <span className="text-sm lg:text-base">{address}</span>
                    </p>


                    <div className="mt-auto">
                        <div>
                            From{" "}
                            <span className="text-xl font-bold">
                                {currency_code} {" "}
                                {rate ? <span>{Math.round(rate.price)}</span> : <div className="inline-block animate-pulse bg-gray-200 w-16 rounded h-4" />}
                            </span>
                            < span className="text-sm font-bold">
                                {" "}/{" "}week
                            </span>
                        </div>

                        <div className="flex justify-between gap-2 mt-3">
                            <a
                                href={`/homes/${id}${range.from ? `?periodStart=${encodeURIComponent(formatToApiDate(range.from))}` : ""}${range.to ? `&periodEnd=${encodeURIComponent(formatToApiDate(range.to))}` : ""}`}
                                target="_blank"
                                className="w-1/2 rounded-lg bg-background text-white p-2 text-center transition-colors duration-300 hover:bg-background/90"
                            >
                                View property
                            </a>

                            <button className="flex w-1/2 items-center justify-center rounded-md bg-primary font-semibold text-white transition-colors duration-300 hover:bg-primary/70">
                                <a
                                    href={`/homes/${id}${range.from ? `?periodStart=${encodeURIComponent(formatToApiDate(range.from))}` : ""}${range.to ? `&periodEnd=${encodeURIComponent(formatToApiDate(range.to))}` : ""}`}
                                    target="_blank"
                                >
                                    Reserve now
                                </a>
                                <ChevronRightIcon size={18} className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CardSkeleton() {
    return Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="relative mt-12 flex h-[500px] flex-col overflow-hidden rounded-lg bg-background shadow-lg">
            <div className="h-2/3 w-full overflow-hidden rounded-lg">
                <Skeleton className="h-full w-full bg-gray-300" />
                <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-primary via-black/40 to-black/10"></div>

                <div
                    className={cn(
                        "absolute flex flex-col inset-x-0 bottom-0 top-1/2 z-10 rounded-lg p-4 text-white",
                        "bg-opacity-20 bg-clip-padding backdrop-blur-md backdrop-filter"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full bg-gray-400" />
                        <Skeleton className="h-4 w-24 bg-gray-400" />
                    </div>
                    <Skeleton className="mt-2 h-6 w-3/4 bg-gray-400" />

                    <div className="flex items-center gap-2 mt-2">
                        <Skeleton className="h-4 w-4 rounded-full bg-gray-400" />
                        <Skeleton className="h-4 w-3/4 bg-gray-400" />
                    </div>

                    <div className="mt-auto">
                        <div className="mt-6 flex items-center">
                            <Skeleton className="h-5 w-20 bg-gray-400" />
                            <Skeleton className="ml-2 h-5 w-10 bg-gray-400" />
                        </div>

                        <div className="flex justify-between gap-2 mt-3">
                            <Skeleton className="h-10 w-1/2 rounded-lg bg-gray-400" />
                            <Skeleton className="h-10 w-1/2 rounded-lg bg-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ));
}

