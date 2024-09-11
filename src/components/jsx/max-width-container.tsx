import type { ReactNode } from "react"

export function MaxWidthContainer({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto w-full h-full max-w-screen-xl overflow-x-hidden px-5 lg:overflow-x-visible">
            {children}
        </div>
    )
}

