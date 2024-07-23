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

import { PhotoGallery } from "./photo-gallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
                {Object.entries(data.amenities)
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
                    ))}
            </div>
        ),
        description: (
            <div
                className="prose mx-auto max-w-none"
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
                    className="text-lg bg-white text-foreground/ text-secondary"
                >
                    <Info size={16} className="mr-2 hidden md:inline" />
                    Amenities
                </TabsTrigger>
                <TabsTrigger
                    value="description"
                    className="text-lg bg-white text-foreground/ text-secondary"
                >
                    <TagIcon size={16} className="mr-2 hidden md:inline" />
                    Description
                </TabsTrigger>
                <TabsTrigger
                    value="photos"
                    className="text-lg bg-white text-foreground/ text-secondary"
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
