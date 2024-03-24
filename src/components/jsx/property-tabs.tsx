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

    // TODO: fix this types
    name: string;
    location: string;
    guests: number;
    bedrooms: number;
    bathrooms: number;
    rating: number;
    image_url: string;

};

type TabsProps = {
    data: PropertyData;
};

const Tabs: React.FC<TabsProps> = ({ data }) => {
    const [activeTab, setActiveTab] = useState<string>('amenities');

    const tabContent = {
        amenities: <div className="grid md:grid-cols-2">
            {Object.entries(data.amenities)
                .filter(([_, items]) => items.length > 0) // Filtering out empty categories
                .map(([category, items]) => (
                    <div key={category} className="mb-4">
                        <h3 className="text-2xl font-semibold capitalize">{category.replace(/-/g, ' ')}</h3>
                        {items.map((item, index) => (
                            <div className="flex gap-2 items-center" key={index}>
                                <PinIcon size={16} className="text-primary" />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                ))}
        </div>,
        description: <p>Nothing here yet</p>,
        photos: <PhotoGallery images={data.images} />
    };

    return (
        <>
            <div className="flex md:flex-row w-full flex-col justify-between md:sticky md:top-14 py-6 gap-6 bg-white">
                {Object.keys(tabContent).map((tabKey) => (
                    <button
                        key={tabKey}
                        className={`flex gap-2 items-center grow p-4 border rounded ${activeTab === tabKey ? 'bg-secondary text-white' : 'bg-transparent text-secondary hover:bg-secondary hover:text-white'}`}
                        onClick={() => setActiveTab(tabKey)}
                    >
                        {tabKey === 'amenities' ? <Info size={16} className="text-primary" /> : tabKey === 'description' ? <Home size={16} className="text-primary" /> : <Image size={16} className="text-primary" />}
                        <span>{tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}</span>
                    </button>
                ))}
            </div>
            {Object.entries(tabContent).map(([key, content]) => (
                <div key={key} className={`md:p-4 ${activeTab !== key ? 'hidden' : ''}`}>
                    {content}
                </div>
            ))}


        </>
    );
};

export default Tabs;
