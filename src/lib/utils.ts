import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const navBarlinks = [
    { name: "VACATION HOMES", href: "/homes" },
    { name: "HOMEOWNER SERVICES", href: "/services" },
    { name: "GUEST HOSPOTALITY", href: "/hospitality" },
    { name: "NOSARA EXPERIENCES", href: "/experiences" },
    { name: "TESTIMONIALS", href: "/testimonials" },
    { name: "CONTACT US", href: "/contact" }
];
