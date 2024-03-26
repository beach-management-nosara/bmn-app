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

export const SearchBox = ({ homes }: { homes: { id: string, name: string }[] }) => {
    const [propertyId, setPropertyId] = useState<string | undefined>()
    return (
        <div className="flex flex-col justify-between gap-4 rounded-lg bg-white px-10 py-12 md:flex-row md:items-end">
            <div className="flex grow flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Home size={20} />
                    <span className="font-sans">
                        Location <span className="text-gray-400">(Optional)</span>
                    </span>
                </div>

                <Select onValueChange={setPropertyId}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Select one house (optional)</SelectLabel>
                            {homes.map(home => <SelectItem key={home.id} value={home.id}>{home.name}</SelectItem>)}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <DateRangePicker propertyId={propertyId} />
        </div>
    );
};
