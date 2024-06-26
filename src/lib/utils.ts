import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const navBarlinks = [
    { name: "VACATION HOMES", href: "/homes" },
    { name: "HOMEOWNER SERVICES", href: "/services" },
    { name: "GUEST HOSPITALITY", href: "/hospitality" },
    { name: "NOSARA EXPERIENCES", href: "/experiences" },
    { name: "TESTIMONIALS", href: "/testimonials" },
    { name: "CONTACT US", href: "/contact" }
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
