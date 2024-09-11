import { cn } from "@/lib/utils"

interface MaxWidthContainerProps {
    children: Readonly<React.ReactNode>
    className?: string
}

export function MaxWidthContainer({ children, className }: MaxWidthContainerProps) {
    return (
        <div className={cn(
            "mx-auto w-full h-full max-w-screen-xl overflow-x-hidden px-5 lg:overflow-x-visible",
            className
        )}>
            {children}
        </div>
    )
}