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

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}

export const formatToApiDate = (date: Date) => `${date.toISOString().split("T")[0]} 00:00:00`;

export const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};
