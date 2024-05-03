import { useEffect, useState } from "react"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useTestimonials } from "@/hooks/useTestimonials"
import { Card, CardContent, CardHeader } from "../ui/card"

export function TestimonialsSlider() {
    const { testimonials } = useTestimonials()
    const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false)

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 640)
        }
        handleResize()

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    })

    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            orientation={isLargeScreen ? "horizontal" : "vertical"}
            className="w-full sm:max-w-[85%] mx-auto md:px-10 lg:max-w-none"
        >
            <CarouselContent className="h-[200px] md:h-auto">
                {testimonials?.map((item) => (
                    <CarouselItem key={item.id} className="lg:basis-1/2">
                        <div className="p-1">
                            <Card className="bg-[#163057] text-white border-none">
                                <CardHeader className="pb-0">
                                    <div className="flex items-center gap-x-4">
                                        <div className="size-14 rounded-full bg-gray-400">
                                            <img src={item.image ?? 'https://via.placeholder.com/150'} alt={item.author} className="rounded-full" width={150} height={150} />
                                        </div>
                                        <div>
                                            <p className="font-bold">{item.author}</p>
                                            <small>
                                                Who stayed at <strong>{item.property}</strong>
                                            </small>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex pt-3 items-center justify-center">
                                    <article className="prose-sm max-h-20 overflow-y-auto">
                                        {item.comments}
                                    </article>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="bg-primary size-12 border-none" />
            <CarouselNext className="bg-primary size-12 border-none" />
        </Carousel>
    )
}