import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIco } from "lucide-react";
import { Calendar } from "../ui/calendar";
import type { SelectRangeEventHandler } from "react-day-picker";

type DateRange = {
    from: Date | undefined;
    to: Date | undefined;
};

function DateRangePicker({ direction = "horizontal" }: { direction?: "horizontal" | "vertical" }) {
    const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);


    const handleSelect: SelectRangeEventHandler = (selectedRange) => {
        if (!selectedRange || !selectedRange.from) return;

        const newRange: DateRange = {
            from: selectedRange.from,
            to: selectedRange.to || undefined,
        };

        setRange(newRange);
    };

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setCalendarOpen(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [calendarRef]);

    return (
        <div className="relative" ref={calendarRef}>
            <div className={`flex ${direction === "vertical" ? 'flex-col' : ''}`}>
                <div className={`flex flex-col gap-2 grow ${direction === "vertical" ? "mb-4" : ""}`}>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <CalendarIco size={20} />
                            <p>Check In</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setCalendarOpen(!isCalendarOpen)}
                        className={`text-sm w-full border px-2 py-2 h-10 text-left text-muted ${direction === "vertical" ? "rounded" : "rounded-l"}`}
                    >
                        {range.from ? range.from.toLocaleDateString() : "Add start date"}
                    </button>
                </div>

                <div className="flex flex-col gap-2 grow">
                    <div className="flex items-center gap-3">
                        <CalendarIco size={20} />
                        <p>Check Out</p>
                    </div>

                    <button
                        onClick={() => setCalendarOpen(true)}
                        className={`text-sm w-full border px-2 py-2 h-10 text-left text-muted ${direction === "vertical" ? "rounded" : "rounded-r"}`}
                    >
                        {range.to ? range.to.toLocaleDateString() : "Add end date"}
                    </button>
                </div>
            </div>

            {isCalendarOpen && (
                <div className="absolute z-10 bg-white">
                    <Calendar mode="range" selected={range} onSelect={handleSelect} className="shadow rounded" />
                </div>
            )}
        </div>
    );
}

export default DateRangePicker;
