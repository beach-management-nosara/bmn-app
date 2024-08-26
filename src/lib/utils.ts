import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const navBarlinks = [
    { name: "home", href: "/" },
    { name: "vacation homes", href: "/homes" },
    // { name: "homeowner services", href: "/services" },
    // { name: "guest hospitality", href: "/hospitality" },
    { name: "nosara experiences", href: "/experiences" },
    // { name: "testimonials", href: "/testimonials" },
    { name: "contact us", href: "/contact" }
];

export function formatCurrency(amount: number, centsDigits = 0) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: centsDigits,
        maximumFractionDigits: centsDigits
    }).format(amount);
}

export const formatToApiDate = (date: Date) => {
    try {
        return `${date.toISOString().split("T")[0]} 00:00:00`;
    } catch (e) {
        console.log(e);
        return "Invalid date";
    }
};

export const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

export function removeHtmlTags(str: string) {
    return str.replace(/<[^>]*>?/gm, "");
}
