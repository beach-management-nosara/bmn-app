import { useState } from "react";

import { Menu, X } from "lucide-react";

import { FacebookIcon } from "../icons/facebook-icon";
import { InstagramIcon } from "../icons/instagram-icon";
import { navBarlinks as links } from "@/lib/utils";

export function MobileNav() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            {menuOpen ? (
                <div
                    className="animate-slide-in-top fixed left-0 top-0 flex h-screen w-full flex-col items-start justify-between bg-black"
                    style={{
                        WebkitAnimation:
                            "slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
                        animation:
                            "slide -in -top 0.5s cubic- bezier(0.250, 0.460, 0.450, 0.940) both"
                    }}
                >
                    <ul className="w-full">
                        <li className="flex justify-end p-6">
                            <button onClick={() => setMenuOpen(!menuOpen)}>
                                <X className="text-white" />
                            </button>
                        </li>
                        <div className="border-t border-gray-100" />
                        {links.map(link => (
                            <li key={link.href} className="my-4">
                                <a href={link.href} className="mx-4 uppercase text-white">
                                    {link.name}
                                </a>
                                <div className="mt-4 border-t border-gray-100" />
                            </li>
                        ))}
                    </ul>

                    <div className="flex w-full justify-between gap-10 p-20">
                        <FacebookIcon className="text-primary size-4" />
                        <InstagramIcon className="text-primary size-4" />
                    </div>
                </div>
            ) : (
                <button onClick={() => setMenuOpen(!menuOpen)} className="pt-2">
                    <Menu />
                </button>
            )}
        </>
    );
}

export default MobileNav;
