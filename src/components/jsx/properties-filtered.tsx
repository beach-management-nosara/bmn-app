import { useEffect, useState } from "react";

import { useProperties } from "@/hooks/useProperties";
import { SearchBox } from "./search-box";
import { PropertiesList } from "./properties-list";
import { heroHomesImg } from "@/assets/images";
import type { Property } from "@/types/property";

export const PropertiesFiltered = () => {
    const { properties, isLoading, success } = useProperties();
    const [selectedProperties, setSelectedProperties] = useState<Property[]>();
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [propertyUnavailable, setPropertyUnavailable] = useState(false);

    useEffect(() => {
        if (success && properties) {
            setSelectedProperties(properties);
        }
    }, [success, properties]);

    return (
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center bg-gray-100">
            <div className="mb-72 flex flex-col items-center md:mb-32">
                <div className="relative h-[450px] w-full">
                    <img
                        src={heroHomesImg.src}
                        alt="hero"
                        width={662}
                        height={225}
                        className="h-[450px] w-full object-cover"
                    />

                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 px-2 text-center text-white">
                        <h2 className="text-2xl uppercase tracking-[.45em] text-[#ffffff3a] text-gray-400 opacity-40 md:text-4xl">
                            EXPERIENCE NOSARA IN STYLE
                        </h2>
                        <h1 className="text-2xl font-medium uppercase leading-tight tracking-[.35em] text-white md:text-[3.6em]">
                            VACATION HOMES
                        </h1>
                    </div>

                    <div className="relative bottom-16 mx-auto w-[90%] md:bottom-20">
                        <SearchBox
                            setSelectedProperties={setSelectedProperties}
                            setIsSearchLoading={setIsSearchLoading}
                            setPropertyUnavailable={setPropertyUnavailable}
                            propertyUnavailable={propertyUnavailable}
                        />
                    </div>
                </div>
            </div>

            {propertyUnavailable && (
                <p className="text-primary md:mb-10">
                    These are properties available for the selected dates!
                </p>
            )}

            <PropertiesList
                selectedProperties={selectedProperties}
                isLoading={isLoading || isSearchLoading}
                success={success}
            />
        </div>
    );
};
