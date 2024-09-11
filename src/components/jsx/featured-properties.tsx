import { SearchIcon } from 'lucide-react'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { useProperties } from "@/hooks/useProperties"
import { removeHtmlTags } from '@/lib/utils'
// import { PropertyRating } from './property-rating'

export function FeaturedProperties() {
    const { properties, isLoading } = useProperties()

    if (isLoading) {
        return <FeaturedPropertiesSkeleton />
    }

    return (
        <div className='px-10'>
            <Carousel>
                <CarouselContent>
                    {properties.slice(0, 3).map(property => (
                        <CarouselItem key={property.id} className='overflow-hidden'>
                            <div className='relative'>
                                <div className='relative'>
                                    <img src={`https://${property?.image_url}`} alt={property?.name} className='w-full rounded-lg h-96 object-cover' />
                                    {/* Add black overlay from right to left */}
                                    <div className='absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50 lg:to-transparent w-full lg:hidden'></div>
                                    <div className='hidden lg:block absolute inset-0 bg-gradient-to-l from-background via-background/80 to-background/50 lg:to-transparent w-full'></div>
                                </div>
                                <div className='absolute w-full lg:w-2/5 right-0 inset-y-0 p-8 flex flex-col items-center lg:items-end justify-center'>
                                    {/* NOTE: Tempo removed by client's request */}
                                    {/* <PropertyRating rating={property?.rating || 0} /> */}
                                    <h2 className='font-semibold text-2xl text-center lg:text-right text-pretty'>{property?.name}</h2>
                                    <p className='flex items-center text-primary gap-3 text-center lg:text-right'>
                                        {property?.address}
                                    </p>
                                    <div className='my-3'>
                                        <p className='text-center lg:text-right text-pretty'>{removeHtmlTags((property?.description.substring(0, 200) + '...') || '')}</p>
                                    </div>
                                    <a href={`/homes/${property?.id}`} className='flex items-center gap-3 text-white bg-primary px-2 py-1.5 rounded-md'>
                                        <SearchIcon className='size-4' />
                                        <span className='text-sm'>View Property</span>
                                    </a>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

function FeaturedPropertiesSkeleton() {
    return (
        <div className='px-10'>
            <Carousel>
                <CarouselContent>
                    {[...Array(3)].map((_, index) => (
                        <CarouselItem key={index}>
                            <div className='relative'>
                                <Skeleton className='w-full h-96 object-cover' />
                                <div className='absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50 lg:to-transparent w-full lg:hidden'></div>
                                <div className='hidden lg:block absolute inset-0 bg-gradient-to-l from-background via-background/90 to-background/50 lg:to-transparent w-full'></div>
                                <div className='absolute w-full lg:w-2/5 right-0 inset-y-0 p-8 flex flex-col items-center lg:items-end justify-center'>
                                    <Skeleton className='h-6 w-24 mb-2' />
                                    <Skeleton className='h-8 w-3/4 mb-4' />
                                    <Skeleton className='h-6 w-40 mb-4' />
                                    <Skeleton className='h-4 w-full mb-3' />
                                    <Skeleton className='h-10 w-32' />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}