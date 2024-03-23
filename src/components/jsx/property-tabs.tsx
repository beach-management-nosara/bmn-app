import { useState } from 'react';
import { PinIcon, Info, Home, Image } from "lucide-react";

import { PhotoGallery } from './photo-gallery';

type PropertyData = {
    amenities: {
        cooking: {
            text: string
        }[]
    };
    images: { url: string; text: string }[]


    name: string;
    location: string;
    guests: number;
    bedrooms: number;
    bathrooms: number;
    rating: number;
    image_url: string;
    // Add other properties as needed
};

type TabsProps = {
    data: PropertyData;
};

const Tabs: React.FC<TabsProps> = ({ data }) => {
    const [activeTab, setActiveTab] = useState<string>('amenities');

    const tabContent = {
        amenities: <div className="grid grid-cols-2">
            {Object.entries(data.amenities)
                .filter(([_, items]) => items.length > 0) // Filtering out empty categories
                .map(([category, items]) => (
                    <div key={category} className="mb-4">
                        <h3 className="text-2xl font-semibold capitalize">{category.replace(/-/g, ' ')}</h3>
                        {items.map((item, index) => (
                            <div className="flex gap-2 items-center" key={index}>
                                <PinIcon size={16} />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                ))}
        </div>,
        description: <p>Nothing here</p>,
        photos: <PhotoGallery images={data.images} />
    };

    return (
        <>
            <div className="flex justify-between sticky top-14 py-6 gap-6 bg-white">
                {Object.keys(tabContent).map((tabKey) => (
                    <button
                        key={tabKey}
                        className={`flex gap-2 items-center grow p-4 border rounded ${activeTab === tabKey ? 'bg-secondary text-white' : 'bg-transparent text-secondary hover:bg-secondary hover:text-white'}`}
                        onClick={() => setActiveTab(tabKey)}
                    >
                        {tabKey === 'ammenities' ? <Info size={16} className="text-primary" /> : tabKey === 'description' ? <Home size={16} className="text-primary" /> : <Image size={16} className="text-primary" />}
                        <span>{tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}</span>
                    </button>
                ))}
            </div>
            {Object.entries(tabContent).map(([key, content]) => (
                <div key={key} className={`tab-content p-4 ${activeTab !== key ? 'hidden' : ''}`}>
                    {content}
                </div>
            ))}
        </>
    );
};

export default Tabs;
