import { useState } from "react";
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
import DateRangePicker from "./day-picker";
import { useProperties } from "@/hooks/useProperties";
import type { DateRange } from "@/types";
import { formatToApiDate } from "@/lib/utils";

export const HomeSearchBox = () => {
    const { propertiesSimple } = useProperties();
    const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });
    const [chosenProperty, setChosenProperty] = useState<{ id: number; name: string }>()

    const handleSelect = (id: number) => {
        const property = propertiesSimple?.find(property => property.id === id)
        setChosenProperty(property)
    }

    const handleSearch = async () => {
        // redirect to /homes page and pass the dates and propertyId so it reflects the search
        if (!range.from || !range.to) {
            throw new Error("Date range incomplete");
        }

        const periodStart = formatToApiDate(range.from);
        const periodEnd = formatToApiDate(range.to);

        window.location.href = `/homes?propertyId=${chosenProperty?.id}&periodStart=${encodeURIComponent(periodStart)}&periodEnd=${encodeURIComponent(periodEnd)}&next=search`
    };

    return (
        <div className="flex flex-col justify-between gap-6 rounded-lg bg-white md:flex-row md:items-end">
            <div className="flex grow flex-col gap-2 w-full">
                <div className="flex items-center gap-3">
                    <Home size={20} />
                    <span className="font-sans">
                        Location <small className="text-gray-400">(Optional)</small>
                    </span>
                </div>

                <Select onValueChange={(value) => handleSelect(parseInt(value, 10))}>
                    <SelectTrigger className="bg-white text-gray-700" title="If you already know where you want to stay, select the house from the list. Otherwise, leave it empty to search for all available houses.">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Select one house (optional)</SelectLabel>
                            {propertiesSimple?.map(home => (
                                <SelectItem key={home.id} value={home.id.toString()}>
                                    {home.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex grow w-full">
                <DateRangePicker range={range} setRange={setRange} />
            </div>

            <div className="w-full">
                <button
                    onClick={handleSearch}
                    className="rounded-lg bg-primary p-2 text-white hover:bg-secondary w-full"
                >
                    Search
                </button>
            </div>
        </div>
    );
};
