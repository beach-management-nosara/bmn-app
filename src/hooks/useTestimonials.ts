import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";

const DEV = import.meta.env.DEV;
const BASE_URL = DEV ? "http://localhost:4321" : import.meta.env.SITE;

type Testimonial = {
    id: number;
    author: string;
    email: string | null;
    comments: string;
    image: string | null;
    property: string;
    consent: boolean;
    show: boolean;
};

export function useTestimonials() {
    const URL = BASE_URL + "/api/testimonials.json";
    const { data, error, isLoading } = useSWR<Testimonial[]>(URL, fetcher);

    return {
        testimonials: data,
        error,
        isLoading
    };
}
