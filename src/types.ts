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

export interface PriceType {
    type: number;
    is_negative: boolean;
    description: string;
    prices: {
        uid: string;
        description: string;
        amount: number;
        fee_type: number | null;
        room_rate_type: number | null;
    }[];
    subtotal: number;
}

export interface RoomType {
    room_type_id: number;
    name: string;
    people: number;
    price_types: PriceType[];
    subtotal: number;
}

export interface QuoteData {
    total_including_vat: number;
    total_excluding_vat: number | null;
    total_vat: number | null;
    property_id: number;
    date_arrival: string;
    date_departure: string;
    currency_code: string;
    room_types: RoomType[];
    add_ons: any[];
    other_items: any[];
    add_ons_subtotal: number;
    rate_policy_user_id: number | null;
    scheduled_payments: {
        type: string;
        date_due: string;
        amount: number;
        is_current: boolean;
    }[];
    scheduled_damage_protection: {
        type: string;
        date_due: string;
        amount: number;
        is_current: boolean;
    }[];
    security_deposit: number;
    total_scheduled_payments: number;
    total_to_collect_manually: number;
    amount_gross: number;
    rental_agreement: string;
    cancellation_policy_text: string;
    security_deposit_text: string;
    is_verification: boolean;
}
