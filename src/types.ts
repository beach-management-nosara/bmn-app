export type PropertyData = {
    name: string;
    description: string;
    amenities: Record<string, { text: string }[]>;
    images: { url: string; text: string }[]
    max_people: number;
    bedrooms: number;
    bathrooms: number;
    image_url: string;
    min_price: number;
    price_unit_in_days: number;
};