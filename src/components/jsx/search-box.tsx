import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Home } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useToast } from "../ui/use-toast";
import DateRangePicker from "./day-picker";
import { useProperties } from "@/hooks/useProperties";
import type { AvailabilityData, DateRange } from "@/types";
import { formatToApiDate } from "@/lib/utils";
import type { Property } from "@/types/property";

export const SearchBox = ({
    setSelectedProperties,
    setIsSearchLoading,
    setPropertyUnavailable,
    propertyUnavailable
}: {
    setSelectedProperties: Dispatch<SetStateAction<Property[] | undefined>>;
    setIsSearchLoading: Dispatch<SetStateAction<boolean>>;
    setPropertyUnavailable: Dispatch<SetStateAction<boolean>>;
    propertyUnavailable: boolean;
}) => {
    const { properties } = useProperties();
    const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });
    const [chosenProperty, setChosenProperty] = useState<Property>();

    const { toast } = useToast();

    const handleSelect = (id: number) => {
        const property = properties?.find(property => property.id === id);
        if (property) {
            setChosenProperty(property);

            // Get the current search parameters from the URL
            const searchParams = new URLSearchParams(window.location.search);

            // Set the propertyId parameter
            searchParams.set("propertyId", property.id.toString());

            // Update the URL with the new parameters
            window.history.pushState({}, "", `${window.location.pathname}?${searchParams}`);

            setPropertyUnavailable(false)
            return;
        }
    };

    const handleSearch = async () => {
        // search available properties for the selected dates
        if (!range.from || !range.to) {
            return;
        }

        const periodStart = formatToApiDate(range.from);
        const periodEnd = formatToApiDate(range.to);

        if (periodStart === "Invalid Date" || periodEnd === "Invalid date") {
            toast({
                title: "Uh oh! Invalid date",
            });
            throw new Error("Invalid Date");

        }

        if (chosenProperty) {
            // check if it is available on those dates
            try {
                const response = await fetch(
                    `/api/availability/${chosenProperty.id}.json?periodStart=${encodeURIComponent(periodStart)}&periodEnd=${encodeURIComponent(periodEnd)}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );
                const availabilityData = (await response.json()) as AvailabilityData;

                const availableOnSelectedPeriod = availabilityData.data[0].periods.every(
                    period => period.available === 1
                );

                if (!availableOnSelectedPeriod) {
                    // if not available, display property not available and continue to show available ones
                    setPropertyUnavailable(true);
                } else {
                    // if yes, redirect to the property page with the dates
                    window.location.href = `/homes/${chosenProperty.id}?periodStart=${encodeURIComponent(periodStart)}&periodEnd=${encodeURIComponent(periodEnd)}`;
                    return;
                }
            } catch (error) {
                console.error("Failed to check property availability", error);
            }
        }

        try {
            setIsSearchLoading(true);
            const response = await fetch(
                `/api/availability.json?periodStart=${encodeURIComponent(periodStart)}&periodEnd=${encodeURIComponent(periodEnd)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const { data } = await response.json();

            if (!response.ok) {
                throw new Error("Network response was not ok on availability");
            }

            // Filter properties array based on available property IDs
            const filteredProperties = properties?.filter(property => data?.includes(property.id));

            setSelectedProperties(filteredProperties);
            setIsSearchLoading(false);
        } catch (error) {
            console.error("Failed to create booking or quote", error);
        }
    };

    useEffect(() => {
        // Get the search parameters from the URL
        const searchParams = new URLSearchParams(window.location.search);
        const periodStartString = searchParams.get("periodStart");
        const periodEndString = searchParams.get("periodEnd");
        const propertyIdString = searchParams.get("propertyId");
        const next = searchParams.get("next");
        const propertyId = propertyIdString && parseInt(propertyIdString, 10);

        // Convert the strings to Date objects
        const periodStartDate = periodStartString ? new Date(periodStartString) : undefined;
        const periodEndDate = periodEndString ? new Date(periodEndString) : undefined;

        // Set the state with the obtained Date objects
        if (periodStartDate && periodEndDate) {
            setRange({ from: periodStartDate, to: periodEndDate });
        }

        const property = properties?.find(property => property.id === propertyId);
        if (property) {
            setChosenProperty(property);
        }
        if (next) { handleSearch() }

    }, [properties, chosenProperty]);

    return (
        <div className="flex flex-col justify-between gap-6 rounded-lg bg-white px-10 py-12 md:flex-row md:items-end">
            <div className="flex grow flex-col gap-2 md:w-1/3">
                <div className="flex items-center gap-3">
                    <Home size={20} />
                    <span className="font-sans">
                        Location <span className="text-gray-400">(Optional)</span>
                    </span>
                </div>

                <Select
                    onValueChange={value => handleSelect(parseInt(value, 10))}
                    value={chosenProperty?.id.toString()}
                >
                    <SelectTrigger title="If you already know where you want to stay, select the house from the list. Otherwise, leave it empty to search for all available houses.">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Select one house (optional)</SelectLabel>
                            {properties?.map(home => (
                                <SelectItem key={home.id} value={home.id.toString()}>
                                    {home.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex grow md:w-1/3">
                <DateRangePicker range={range} setRange={setRange} setPropertyUnavailable={setPropertyUnavailable} />
            </div>

            <div className="md:w-1/3">
                {propertyUnavailable && (
                    <small className="text-red-400">
                        Property unavailable for the selected period
                    </small>
                )}

                <button
                    onClick={handleSearch}
                    className="w-full grow rounded-lg bg-primary p-2 text-white hover:bg-secondary"
                >
                    Search
                </button>
            </div>
        </div>
    );
};
