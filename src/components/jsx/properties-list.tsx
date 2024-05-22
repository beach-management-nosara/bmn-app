import { useEffect, useState } from "react";
import { ChevronRightIcon, MapPinIcon, StarIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import type { Property } from "@/types/property";
import { formatToApiDate } from "@/lib/utils";
import type { DateRange } from "@/types";
import { usePropertyDetails } from "@/hooks/usePropertyDetails";

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
        <div className="mb-16 grid w-full max-w-7xl grid-cols-1 gap-6 px-5 md:grid-cols-2 lg:grid-cols-3 xl:px-0">
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
    const { id, image_url, name, address, currency_code, min_price, rating } = property;
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
        <div className="flex h-[500px] flex-col rounded-lg border bg-white shadow-lg">
            <div className="h-1/2 w-full overflow-hidden rounded-t-lg">
                <img
                    src={imageUrl}
                    alt={name}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="flex h-1/2 flex-col justify-between px-4 py-3">
                <div className="flex-1">
                    <h3 className="text-balance text-xl font-bold tracking-wider">{name}</h3>

                    <hr className="border-balance border-1 my-2 border-opacity-50" />

                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            Price from{" "}
                            <span className="text-xl font-bold text-primary">
                                {currency_code} {" "}
                                {rate ? <span>{Math.round(rate.price)}</span> : <div className="inline-block animate-pulse bg-gray-200 w-16 rounded h-4" />}
                            </span>
                            < span className="text-sm text-primary font-bold">
                                {" "}/{" "}week
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <StarIcon size={16} className="text-primary" />
                            <span>
                                {rating.toString() !== "0"
                                    ? Number(rating).toFixed(2)
                                    : "Not rated yet"}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <p className="flex items-center gap-1.5">
                            <MapPinIcon size={16} className="text-primary" />
                            <span>{address}</span>
                        </p>

                    </div>
                </div>
                <hr className="border-balance border-1 my-2 border-opacity-50" />

                <div className="flex justify-between gap-2">
                    <a
                        href={`/homes/${id}${range.from ? `?periodStart=${encodeURIComponent(formatToApiDate(range.from))}` : ""}${range.to ? `&periodEnd=${encodeURIComponent(formatToApiDate(range.to))}` : ""}`}
                        target="_blank"
                        className="w-1/2 rounded-lg bg-gray-100 p-2 text-center transition-colors duration-300 hover:bg-gray-200"
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
    );
}

function CardSkeleton() {
    return Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex h-[550px] flex-col rounded-lg border bg-white shadow-lg">
            <Skeleton className="h-1/2 w-full rounded-b-none rounded-t-lg bg-gray-200" />
            <div className="h-1/2 p-4">
                <Skeleton className="h-6 w-full bg-gray-200" />
                <hr className="border-balance border-1 my-2 border-opacity-50" />
                <div className="mb-6 flex justify-between">
                    <Skeleton className="h-4 w-1/2 bg-gray-200" />
                    <Skeleton className="h-4 w-1/5 bg-gray-200" />
                </div>
                <Skeleton className="h-4 w-1/2 bg-gray-200" />
                <Skeleton className="my-3 h-12 w-full bg-gray-200" />
                <hr className="border-balance border-1 my-2 border-opacity-50" />
                <div className="flex items-center gap-6">
                    <Skeleton className="h-10 w-1/2 bg-gray-200" />
                    <Skeleton className="h-10 w-1/2 bg-gray-200" />
                </div>
            </div>
        </div>
    ));
}
