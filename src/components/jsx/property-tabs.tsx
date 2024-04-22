import React from 'react';
import { Info, TagIcon, HomeIcon, Image, UtensilsIcon, CoffeeIcon, TvIcon, WifiIcon, AirplayIcon, SunIcon, WashingMachineIcon, ShirtIcon, LockIcon, ParkingMeterIcon, DropletIcon, BedIcon, AirVentIcon, CheckIcon } from "lucide-react";

import { PhotoGallery } from './photo-gallery';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import type { PropertyData } from '../../types';

const AMENITY_ICONS = {
    "room": HomeIcon,
    "cooking": UtensilsIcon,
    "coffee machine": CoffeeIcon,
    "entertainment": TvIcon,
    "wireless broadband internet": WifiIcon,
    "heating": AirplayIcon,
    "air conditioning": AirVentIcon,
    "laundry": WashingMachineIcon,
    "clothes dryer": ShirtIcon,
    "safe": LockIcon,
    "outside": SunIcon,
    "parking": ParkingMeterIcon,
    "sanitary": DropletIcon,
    "sleeping": BedIcon,
    "miscellaneous": CheckIcon
}

interface PropertyDetailsTabsProps {
    data: PropertyData
}

export function PropertyDetailsTabs({ data }: PropertyDetailsTabsProps) {
    function parseCategoryName(category: string) {
        return category.replace(/-/g, ' ');
    }

    const tabContent = {
        amenities: <div className="grid md:grid-cols-2">
            {Object.entries(data.amenities)
                .filter(([_, items]) => items.length > 0) // Filtering out empty categories
                .map(([category, items]) => (
                    <div key={category} className="mb-4">
                        <h3 className="text-2xl font-semibold capitalize">{parseCategoryName(category)}</h3>
                        {items.map((item, index) => (
                            <div className="flex gap-2 items-center" key={index}>
                                {/* <PinIcon size={16} className="text-primary" /> */}
                                {React.createElement(AMENITY_ICONS[parseCategoryName(category) as keyof typeof AMENITY_ICONS] || HomeIcon, { size: 16, className: 'text-primary' })}
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                ))}
        </div>,
        description: <div className="prose max-w-none mx-auto" dangerouslySetInnerHTML={{ __html: data.description }} />,
        photos: <PhotoGallery images={data.images} />
    };

    return (
        <Tabs defaultValue="amenities" className="mt-4">
            <TabsList className="grid w-full grid-cols-3 bg-gray-200 gap-3 h-min p-2.5">
                <TabsTrigger value="amenities" className="text-white bg-white text-foreground/70 text-lg">
                    <Info size={16} className="mr-2" />
                    Amenities
                </TabsTrigger>
                <TabsTrigger value="description" className="text-white bg-white text-foreground/70 text-lg">
                    <TagIcon size={16} className="mr-2" />
                    Description
                </TabsTrigger>
                <TabsTrigger value="photos" className="text-white bg-white text-foreground/70 text-lg">
                    <Image size={16} className="mr-2" />
                    Photos
                </TabsTrigger>
            </TabsList>

            {Object.entries(tabContent).map(([key, value]) => (
                <TabsContent key={key} value={key} className='mt-10 px-6'>
                    {value}
                </TabsContent>
            ))}
        </Tabs>
    )
}
