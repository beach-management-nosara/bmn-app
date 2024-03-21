import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Home, Calendar } from "lucide-react";
import DateRangePicker from "./day-picker";

export const SearchBox = () => {
    return (
        <div className="flex flex-col justify-between gap-6 rounded-lg bg-white px-10 py-12 md:flex-row md:items-end">
            <div className="flex grow flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Home />
                    <span className="font-sans">
                        Location <span className="text-gray-400">(Optional)</span>
                    </span>
                </div>

                <Select>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Select one house (optional)</SelectLabel>
                            <SelectItem value="1">Los Pochotes</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex grow flex-col gap-2">
                <div className="flex grow">
                    <div className="flex grow flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <Calendar />
                            <p>Check In</p>
                        </div>
                    </div>
                    <div className="flex grow flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <Calendar />
                            <p>Check Out</p>
                        </div>
                    </div>
                </div>
                <DateRangePicker />
            </div>
            <button className="grow rounded-lg bg-primary p-2 text-white hover:bg-teal-600 md:w-auto">
                Search
            </button>
        </div>
    );
};
