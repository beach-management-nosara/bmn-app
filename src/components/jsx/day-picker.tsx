import { useState } from "react";
import { Calendar } from "../ui/calendar";

type DateRange = {
    from: Date | undefined;
    to: Date | undefined;
};

function DateRangePicker() {
    const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });
    const [isCalendarOpen, setCalendarOpen] = useState(false);

    const handleSelect = (selectedRange: any) => {
        if (!selectedRange || !selectedRange.from) return;

        const newRange: DateRange = {
            from: selectedRange.from,
            to: selectedRange.to || undefined
        };

        setRange(newRange);
    };

    return (
        <div className="relative">
            <div className="flex h-10">
                <button
                    onClick={() => setCalendarOpen(!isCalendarOpen)}
                    className="w-1/2 rounded-l border pl-2 text-left text-sm text-muted"
                >
                    {range.from ? range.from.toLocaleDateString() : "Add start date"}
                </button>
                <button
                    onClick={() => setCalendarOpen(!isCalendarOpen)}
                    className="w-1/2 rounded-r border pl-2 text-left text-sm text-muted"
                >
                    {range.to ? range.to.toLocaleDateString() : "Add end date"}
                </button>
            </div>

            {isCalendarOpen && (
                <div className="absolute z-10 bg-white">
                    <Calendar mode="range" selected={range} onSelect={handleSelect} />
                </div>
            )}
        </div>
    );
}

export default DateRangePicker;
