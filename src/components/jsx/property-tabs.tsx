import React from "react";
import {
    Info,
    TagIcon,
    HomeIcon,
    Image,
    UtensilsIcon,
    CoffeeIcon,
    TvIcon,
    WifiIcon,
    AirplayIcon,
    SunIcon,
    WashingMachineIcon,
    ShirtIcon,
    LockIcon,
    ParkingMeterIcon,
    DropletIcon,
    BedIcon,
    AirVentIcon,
    CheckIcon
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PhotoGallery } from "./photo-gallery";
import type { PropertyData } from "../../types";

const AMENITY_ICONS = {
    room: HomeIcon,
    cooking: UtensilsIcon,
    "coffee machine": CoffeeIcon,
    entertainment: TvIcon,
    "wireless broadband internet": WifiIcon,
    heating: AirplayIcon,
    "air conditioning": AirVentIcon,
    laundry: WashingMachineIcon,
    "clothes dryer": ShirtIcon,
    safe: LockIcon,
    outside: SunIcon,
    parking: ParkingMeterIcon,
    sanitary: DropletIcon,
    sleeping: BedIcon,
    miscellaneous: CheckIcon
};

interface PropertyDetailsTabsProps {
    data: PropertyData;
}

export function PropertyDetailsTabs({ data }: PropertyDetailsTabsProps) {
    function parseCategoryName(category: string) {
        return category.replace(/-/g, " ");
    }

    const tabContent = {
        amenities: (
            <div className="grid md:grid-cols-2">
                {Object.entries(data.amenities).length > 0 ? Object.entries(data.amenities)
                    .filter(([_, items]) => items.length > 0) // Filtering out empty categories
                    .map(([category, items]) => (
                        <div key={category} className="mb-4">
                            <h3 className="text-2xl font-semibold capitalize">
                                {parseCategoryName(category)}
                            </h3>
                            {items.map((item, index) => (
                                <div className="flex items-center gap-2" key={index}>
                                    {/* <PinIcon size={16} className="text-primary" /> */}
                                    {React.createElement(
                                        AMENITY_ICONS[
                                        parseCategoryName(
                                            category
                                        ) as keyof typeof AMENITY_ICONS
                                        ] || HomeIcon,
                                        { size: 16, className: "text-primary" }
                                    )}
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    )) : (
                    <div className="flex flex-col items-center justify-center w-full h-96">
                        <Skeleton className="h-6 w-32 mb-3" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                )
                }
            </div>
        ),
        description: (
            <div
                className="prose mx-auto max-w-none bg-white p-5 rounded-md"
                dangerouslySetInnerHTML={{ __html: data.description }}
            />
        ),
        photos: <PhotoGallery images={data.images} />
    };

    return (
        <Tabs defaultValue="amenities" className="my-4">
            <TabsList className="grid h-min w-full grid-cols-3 gap-3 bg-gray-200 p-2.5">
                <TabsTrigger
                    value="amenities"
                    className="text-lg bg-white text-foreground/ text-primary"
                >
                    <Info size={16} className="mr-2 hidden md:inline" />
                    Amenities
                </TabsTrigger>
                <TabsTrigger
                    value="description"
                    className="text-lg bg-white text-foreground/ text-primary"
                >
                    <TagIcon size={16} className="mr-2 hidden md:inline" />
                    Description
                </TabsTrigger>
                <TabsTrigger
                    value="photos"
                    className="text-lg bg-white text-foreground/ text-primary"
                >
                    <Image size={16} className="mr-2 hidden md:inline" />
                    Photos
                </TabsTrigger>
            </TabsList>

            {Object.entries(tabContent).map(([key, value]) => (
                <TabsContent key={key} value={key} className="mt-10 px-6">
                    {value}
                </TabsContent>
            ))}
        </Tabs>
    );
}

export function PropertyDetailsTabsSkeleton() {
    return (
        <Tabs defaultValue="amenities" className="my-4">
            <TabsList className="grid h-min w-full grid-cols-3 gap-3 bg-gray-200 p-2.5">
                <TabsTrigger
                    value="amenities"
                    className="text-lg bg-white text-foreground/ text-primary"
                >
                    <Info size={16} className="mr-2 hidden md:inline" />
                    Amenities
                </TabsTrigger>
                <TabsTrigger
                    value="description"
                    className="text-lg bg-white text-foreground/ text-primary"
                    disabled // Disable other tabs during loading
                >
                    <TagIcon size={16} className="mr-2 hidden md:inline" />
                    Description
                </TabsTrigger>
                <TabsTrigger
                    value="photos"
                    className="text-lg bg-white text-foreground/ text-primary"
                    disabled // Disable other tabs during loading
                >
                    <Image size={16} className="mr-2 hidden md:inline" />
                    Photos
                </TabsTrigger>
            </TabsList>

            <TabsContent value="amenities" className="mt-10 px-6">
                <div className="grid md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="mb-4">
                            <Skeleton className="h-6 w-32 mb-3" />
                            <div className="flex items-center gap-2 mb-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            </TabsContent>
        </Tabs>
    );
}
