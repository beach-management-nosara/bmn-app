export type PropertyData = {
    id: string;
    name: string;
    description: string;
    amenities: Record<string, { text: string }[]>;
    images: { url: string; text: string }[];
    max_people: number;
    bedrooms: number;
    bathrooms: number;
    image_url: string;
    min_price: number;
    price_unit_in_days: number;
};

export type AvailabilityData = {
    data: {
        periods: {
            available: 0 | 1;
            start: string;
            end: string;
        }[];
    }[];
};

export type DateRange = {
    from: Date | undefined;
    to: Date | undefined;
};

export type Rate = {
    prices: {
        min_stay: number;
        price_per_day: number;
    }[];
};
