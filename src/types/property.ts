export interface Property {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    hide_address: boolean;
    zip: string;
    city: string;
    state: string;
    country: string;
    image_url: string;
    has_addons: boolean;
    has_agreement: boolean;
    agreement_text: string;
    agreement_url: any;
    contact: Contact;
    rating: number;
    price_unit_in_days: number;
    min_price: number;
    original_min_price: number;
    max_price: number;
    original_max_price: number;
    rooms: Room[];
    in_out_max_date: string;
    in_out: any;
    currency_code: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    subscription_plans: string[];
}

export interface Contact {
    spoken_languages: string[];
}

export interface Room {
    id: number;
    name: string;
}
