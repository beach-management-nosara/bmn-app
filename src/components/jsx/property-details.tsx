import { BathIcon, BedIcon, MapPinIcon, StarIcon, UsersIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { usePropertyDetails } from "@/hooks/usePropertyDetails";
import type { PropertyData } from "@/types";
import { PropertyDetailsTabs } from "./property-tabs";
import Reviews from "./reviews";
import { PropertyRating } from "./property-rating";
import { cn } from "@/lib/utils";
import { MaxWidthContainer } from "./max-width-container";
import { BookingCard } from "./booking-card";

interface PropertyDetailsProps {
    slug: string;
}

export function PropertyDetails({ slug }: PropertyDetailsProps) {
    const { property, room, isLoading } = usePropertyDetails(slug);

    return (
        <>
            <section className="relative h-[60vh] overflow-hidden">
                <div className="absolute inset-0">
                    <div className={cn("h-full w-full bg-gray-400", !room?.image_url && "animate-pulse")}>
                        {property?.image_url && (
                            <img src={'https://' + room?.image_url} alt="banner" className="h-full w-full object-cover" />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30">
                    </div>
                </div>

                <div className="mx-auto h-full max-w-screen-xl overflow-x-hidden px-5 lg:overflow-x-visible">
                    <div className="relative flex h-full flex-col justify-center">
                        <div className="flex items-center gap-2">
                            <PropertyRating rating={property?.rating ?? 0} />
                        </div>
                        {property?.name ? (
                            <h1 className="mb-4 w-full text-4xl font-semibold leading-tight lg:text-5xl">
                                {property?.name}
                            </h1>
                        ) : (
                            <Skeleton className="mb-4 w-1/2 h-12 bg-gray-200" />
                        )}
                        {
                            property?.address ? (
                                <p className="flex items-center gap-3">
                                    <MapPinIcon className="inline-block size-5 flex-shrink-0 text-primary" />
                                    {property?.address}
                                </p>
                            ) : (
                                <Skeleton className="w-40 h-5 bg-gray-200" />
                            )
                        }

                        <div className="flex flex-col gap-10 md:flex-row mt-4">
                            <div className="flex items-center gap-2">
                                <UsersIcon className="text-white size-6" />
                                {isLoading ? (
                                    <Skeleton className="size-4 bg-gray-200" />
                                ) : (
                                    <span>{room?.max_people}</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <BedIcon className="text-white size-6" />
                                {isLoading ? (
                                    <Skeleton className="size-4 bg-gray-200" />
                                ) : (
                                    <span>{room?.bedrooms}</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <BathIcon className="text-white size-6" />
                                {isLoading ? (
                                    <Skeleton className="size-4 bg-gray-200" />
                                ) : (
                                    <span>{room?.bathrooms}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="property-details" className="py-10">
                <MaxWidthContainer>
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="w-full col-span-2">
                            {room && <PropertyDetailsTabs data={room as PropertyData} />}
                        </div>
                        <BookingCard slug={slug} />
                    </div>
                </MaxWidthContainer>
            </section>

            <section id="reviews" className="py-10">
                <MaxWidthContainer>
                    <Reviews propertyId={slug} />
                </MaxWidthContainer>
            </section>
        </>
    )
}
