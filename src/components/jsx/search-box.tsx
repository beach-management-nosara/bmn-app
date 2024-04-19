import type { PropsWithChildren } from "react";
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

export const SearchBox = () => {
    const { propertiesSimple } = useProperties()

    return (
        <div className="flex flex-col justify-between gap-6 rounded-lg bg-white px-10 py-12 md:flex-row md:items-end">

            <div className="flex grow flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Home size={20} />
                    <span className="font-sans">
                        Location <span className="text-gray-400">(Optional)</span>
                    </span>
                </div>

                {/* <SelectTooltip> */}
                <Select>
                    <SelectTrigger title="If you already know where you want to stay, select the house from the list. Otherwise, leave it empty to search for all available houses.">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Select one house (optional)</SelectLabel>
                            {propertiesSimple.map(home => <SelectItem key={home.id} value={home.id.toString()}>{home.name}</SelectItem>)}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {/* </SelectTooltip> */}
            </div>
            <div className="grow">
                <DateRangePicker />
            </div>

            <button className="grow rounded-lg bg-primary p-2 text-white hover:bg-secondary md:w-auto">
                Search
            </button>
        </div>
    );
};
