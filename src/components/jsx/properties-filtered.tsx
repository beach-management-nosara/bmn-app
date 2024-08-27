import { useEffect, useState } from "react";

import { useProperties } from "@/hooks/useProperties";
import { SearchBox } from "./search-box";
import { PropertiesList } from "./properties-list";
import { heroHomesImg } from "@/assets/images";
import type { Property } from "@/types/property";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { MaxWidthContainer } from "./max-width-container";


export const PropertiesFiltered = () => {
    const [page, setPage] = useState(1);
    const { properties, isLoading, success } = useProperties({ page });
    const [selectedProperties, setSelectedProperties] = useState<Property[]>();
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [propertyUnavailable, setPropertyUnavailable] = useState(false);

    // Don't remove, so we can easily add it back
    // const totalPages = selectedProperties?.length != 10 ? 1 : Math.ceil((count ?? 0) / PAGE_SIZE);

    useEffect(() => {
        if (success && properties) {
            setSelectedProperties(properties);
        }
    }, [success, properties]);

    return (
        <>
            <section id="home-hero" className="relative h-[66vh] overflow-hidden">
                <div className="absolute inset-0">
                    <div className="h-full w-full bg-gray-400">
                        <img src={heroHomesImg.src} alt="banner" className="h-full w-full object-cover" />
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/10">
                    </div>
                </div>

                <MaxWidthContainer>
                    <div className="relative flex h-2/3 flex-col justify-center lg:h-full">
                        <div className="flex items-center">
                            <div className="hidden border-t border-primary lg:block lg:w-1/5 lg:max-w-[4rem]">
                            </div>
                            <span
                                className="border-b-2 border-primary pb-2 text-sm font-semibold uppercase tracking-widest text-primary lg:ml-4 lg:border-none lg:pb-0"
                            >
                                Experience Nosara in Style
                            </span>
                        </div>
                        <h1 className="my-4 w-full text-4xl leading-tight lg:w-3/4 lg:text-5xl">
                            Vacation Homes
                        </h1>
                    </div>
                    <div
                        className="absolute bottom-0 left-1/2 mx-auto w-full max-w-screen-xl -translate-x-1/2 rounded-lg bg-white text-foreground shadow-lg"
                    >
                        <SearchBox
                            setSelectedProperties={setSelectedProperties}
                            setIsSearchLoading={setIsSearchLoading}
                            setPropertyUnavailable={setPropertyUnavailable}
                            propertyUnavailable={propertyUnavailable}
                        />
                    </div>
                </MaxWidthContainer>
            </section>
            <MaxWidthContainer>
                {propertyUnavailable && (
                    <p className="my-6 text-primary md:mb-10">
                        These are properties available for the selected dates!
                    </p>
                )}
                <PropertiesList
                    selectedProperties={selectedProperties}
                    isLoading={isLoading || isSearchLoading}
                    success={success}
                />
            </MaxWidthContainer>
        </>
    )

    // return (
    //     <div className="mx-auto flex max-w-screen-2xl flex-col items-center">
    //         <div className="mb-72 flex flex-col items-center md:mb-32">
    //             <div className="relative h-[450px] w-full">
    //                 <img
    //                     src={heroHomesImg.src}
    //                     alt="hero"
    //                     width={662}
    //                     height={225}
    //                     className="h-[450px] w-full object-cover"
    //                 />

    //                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 px-2 text-center text-white">
    //                     <h2 className="text-2xl uppercase tracking-[.45em] text-[#ffffff3a] text-gray-400 opacity-40 md:text-4xl">
    //                         EXPERIENCE NOSARA IN STYLE
    //                     </h2>
    //                     <h1 className="text-2xl font-medium uppercase leading-tight tracking-[.35em] text-white md:text-[3.6em]">
    //                         VACATION HOMES
    //                     </h1>
    //                 </div>

    //                 <div className="relative bottom-16 mx-auto w-[90%] md:bottom-20">
    //                     <SearchBox
    //                         setSelectedProperties={setSelectedProperties}
    //                         setIsSearchLoading={setIsSearchLoading}
    //                         setPropertyUnavailable={setPropertyUnavailable}
    //                         propertyUnavailable={propertyUnavailable}
    //                     />
    //                 </div>
    //             </div>
    //         </div>

    //         {propertyUnavailable && (
    //             <p className="my-6 text-primary md:mb-10">
    //                 These are properties available for the selected dates!
    //             </p>
    //         )}

    //         <PropertiesList
    //             selectedProperties={selectedProperties}
    //             isLoading={isLoading || isSearchLoading}
    //             success={success}
    //         />
    //     </div>
    // );
};

// import { useEffect, useState } from "react";

// import { useProperties } from "@/hooks/useProperties";
// import { PropertiesList } from "./properties-list";
// import type { Property } from "@/types/property";

// export const PropertiesFiltered = () => {
//     const { properties, isLoading, success } = useProperties();
//     const [selectedProperties, setSelectedProperties] = useState<Property[]>();

//     // Don't remove, so we can easily add it back
//     // const totalPages = selectedProperties?.length != 10 ? 1 : Math.ceil((count ?? 0) / PAGE_SIZE);

//     useEffect(() => {
//         if (success && properties) {
//             setSelectedProperties(properties);
//         }
//     }, [success, properties]);

//     return (
//         <div className="mx-auto h-full max-w-screen-2xl py-16 overflow-x-hidden px-5 lg:overflow-x-visible">
//             <PropertiesList
//                 selectedProperties={selectedProperties}
//                 isLoading={isLoading}
//                 success={success}
//             />
//         </div>
//     );
// };
