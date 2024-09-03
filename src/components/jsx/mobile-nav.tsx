import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FacebookIcon } from "../icons/facebook-icon";
import { InstagramIcon } from "../icons/instagram-icon";
import { WhatsappIcon } from "../icons/whatsapp-icon";
import { MailIcon } from "../icons/mail-icon";
import { cn, navBarlinks as links } from "@/lib/utils";

export function MobileNav({ pathname }: { pathname: string }) {
    return (
        <header>
            <div className={cn(
                "fixed left-1/2 top-4 z-50 flex w-[90%] -translate-x-1/2 items-center justify-between px-4 py-4 lg:hidden",
                "bg-white rounded-lg"
            )}>
                <a href="/">
                    <img src='/logo.png' alt="logo" width={90} />
                </a>
                <Sheet>
                    <SheetTrigger>
                        <Menu className="text-primary size-8" />
                    </SheetTrigger>
                    <SheetContent side="left" className="border-none text-white flex flex-col">
                        <nav className="mt-20 space-y-4">
                            {links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className={cn(
                                        "text-lg block py-4 font-semibold uppercase",
                                        pathname === link.href ? "text-primary" : "text-white"
                                    )}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                        <div className="mt-auto flex items-center justify-center gap-10">
                            <a href="https://www.facebook.com/">
                                <FacebookIcon className="size-8 text-white" />
                            </a>
                            <a href="https://www.instagram.com/">
                                <InstagramIcon className="size-8 text-white" />
                            </a>
                            <a href="https://wa.me/">
                                <WhatsappIcon className="size-8 text-white" />
                            </a>
                            <a href="mailto:info@beachmanagementnosara.com">
                                <MailIcon className="size-8 text-white" />
                            </a>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
