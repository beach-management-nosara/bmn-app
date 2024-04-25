import { BathIcon, BedIcon, ChevronRightIcon, MapPinIcon, StarIcon, UsersIcon } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

import type { Property } from "@/types/property"

export function PropertiesList({ selectedProperties, isLoading, success }: { selectedProperties?: Property[]; isLoading: any, success: any }) {
    return <div className="grid w-full max-w-7xl grid-cols-1 gap-6 px-5 md:grid-cols-2 lg:grid-cols-3 xl:px-0 mb-16">
        {isLoading && <CardSkeleton />}
        {success && selectedProperties?.map(property => <PropertyCard key={property.id} property={property} />)}
    </div>
}

function PropertyCard({ property }: { property: Property }) {
    const { id, image_url, name, address, currency_code, min_price, rating } = property
    const imageUrl = 'https:' + image_url

    return (
        <div className="flex h-[550px] flex-col rounded-lg border bg-white shadow-lg">
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
                        <p>
                            Price from{" "}
                            <span className="text-xl font-bold text-primary">
                                {currency_code}{" "}
                                {Math.round(min_price).toFixed(2)}
                            </span>
                        </p>

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

                        <div className="flex items-center gap-8">
                            <p className="flex items-center gap-2">
                                <BathIcon size={16} className="text-primary" />
                                <span>0</span>
                            </p>

                            <p className="flex items-center gap-2">
                                <BedIcon size={16} className="text-primary" />
                                <span>0</span>
                            </p>

                            <p className="flex items-center gap-2">
                                <UsersIcon size={16} className="text-primary" />
                                <span>0</span>
                            </p>
                        </div>
                    </div>
                </div>
                <hr className="border-balance border-1 my-2 border-opacity-50" />

                <div className="flex justify-between gap-2">
                    <a
                        href={`/homes/${id}`}
                        className="w-1/2 rounded-lg bg-gray-100 p-2 text-center transition-colors duration-300 hover:bg-gray-200"
                    >
                        View property
                    </a>

                    <button className="flex w-1/2 items-center justify-center rounded-md bg-primary font-semibold text-white transition-colors duration-300 hover:bg-primary/70">
                        <span>Reserve now</span>
                        <ChevronRightIcon size={18} className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    )
}

function CardSkeleton() {
    return (
        Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex h-[550px] flex-col rounded-lg border bg-white shadow-lg">
                <Skeleton className="h-1/2 w-full rounded-t-lg rounded-b-none bg-gray-200" />
                <div className="h-1/2 p-4">
                    <Skeleton className="h-6 w-full bg-gray-200" />
                    <hr className="border-balance border-1 my-2 border-opacity-50" />
                    <div className="flex justify-between mb-6">
                        <Skeleton className="h-4 w-1/2 bg-gray-200" />
                        <Skeleton className="h-4 w-1/5 bg-gray-200" />
                    </div>
                    <Skeleton className="h-4 w-1/2 bg-gray-200" />
                    <Skeleton className="h-12 w-full my-3 bg-gray-200" />
                    <hr className="border-balance border-1 my-2 border-opacity-50" />
                    <div className="flex items-center gap-6">
                        <Skeleton className="h-10 w-1/2 bg-gray-200" />
                        <Skeleton className="h-10 w-1/2 bg-gray-200" />
                    </div>
                </div>
            </div>
        ))
    )
}