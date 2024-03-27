import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIco, Mail, UserRound } from "lucide-react";
import type { SelectRangeEventHandler } from "react-day-picker";

import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";

type DateRange = {
    from: Date | undefined;
    to: Date | undefined;
};

type UnavailableDays = {
    from: Date; to: Date
}[]

type AvailabilityData = {
    data: {
        periods: {
            available: 0 | 1,
            start: string
            end: string
        }[]
    }[]
}

const formatToApiDate = (date: Date) => `${date.toISOString().split('T')[0]} 00:00:00`;

function DateRangePicker({ direction = "horizontal", propertyId, maxGuests }: { direction?: "horizontal" | "vertical"; propertyId?: string; maxGuests?: number }) {
    const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

    const currentMonth = new Date();
    currentMonth.setDate(1); // Earliest month users can navigate to is current month
    const [unavailableDays, setUnavailableDays] = useState<UnavailableDays>([{ from: currentMonth, to: new Date() }]);

    const handleSelect: SelectRangeEventHandler = (selectedRange) => {
        if (!selectedRange || !selectedRange.from) return;

        if (selectedRange.from && selectedRange.to) {
            // Validate range only after to has been selected
            if (!isRangeValid(selectedRange.from, selectedRange.to, unavailableDays)) {
                return;
            }
        }

        const newRange: DateRange = {
            from: selectedRange.from,
            to: selectedRange.to || undefined,
        };

        setRange(newRange);
    };

    const isRangeValid = (rangeStart: Date, rangeEnd: Date, unavailableDays: UnavailableDays) => {
        const startTimestamp = rangeStart.getTime(); // Convert to timestamp
        const endTimestamp = rangeEnd.getTime(); // Convert to timestamp

        for (let day of unavailableDays) {
            const dayStartTimestamp = day.from.getTime(); // Convert to timestamp
            const dayEndTimestamp = day.to.getTime(); // Convert to timestamp

            // Now perform the comparison using timestamps
            if ((dayStartTimestamp <= endTimestamp) && (dayEndTimestamp >= startTimestamp)) {
                return false; // The selected range is invalid as it overlaps with an unavailable range
            }
        }
        return true; // The selected range is valid if it does not overlap with any unavailable ranges
    };

    const handleSearch = async () => {
        if (!range.from || !range.to) {
            console.error("Date range is incomplete.");
            return;
        }
        const periodStart = formatToApiDate(range.from);
        const periodEnd = formatToApiDate(range.to);

        try {
            const response = await fetch(
                `/api/availability/${propertyId}?periodStart=${encodeURIComponent(periodStart)}&periodEnd=${encodeURIComponent(periodEnd)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const availabilityData = await response.json() as AvailabilityData;

            const allAvailable = availabilityData.data[0].periods.every(period => period.available === 1);

            if (allAvailable) {
                window.location.href = '/checkout';
            }

        } catch (error) {
            console.error('Failed to fetch availability:', error);
        }
    };

    useEffect(() => {
        const fetchAvailability = async () => {
            const now = new Date();
            const periodStart = formatToApiDate(now);

            const yearFromNow = new Date(now);
            yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);
            const periodEnd = formatToApiDate(yearFromNow);

            const response = await fetch(
                `/api/availability/${propertyId}?periodStart=${encodeURIComponent(periodStart)}&periodEnd=${encodeURIComponent(periodEnd)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            const availabilityData = await response.json() as AvailabilityData

            // Map through periods and filter out any undefined values
            const newUnavailableDays = availabilityData.data[0].periods.reduce((acc: { from: Date; to: Date }[], period) => {
                if (period.available === 0) {
                    // Make dates UTC midnight
                    const from = new Date(period.start + 'T00:00');
                    const to = new Date(period.end + 'T00:00');
                    acc.push({ from, to });
                }
                return acc;
            }, []);

            // The first of the current month to yesterday should always be disabled
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const startOfCurrentMonth = new Date();
            startOfCurrentMonth.setDate(1);
            startOfCurrentMonth.setHours(0, 0, 0, 0); // Normalize the start time

            setUnavailableDays(prevState => [
                ...prevState,
                ...newUnavailableDays,
                { from: startOfCurrentMonth, to: yesterday } // Add this to ensure the past days are covered
            ]);
        };

        fetchAvailability();
    }, [propertyId]);

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
        <div className={`relative flex gap-4 ${direction === "vertical" ? 'flex-col w-full pt-4' : 'md:items-end md:w-2/3 flex-col md:flex-row'}`} ref={calendarRef}>
            <div className={`flex ${direction === "vertical" ? 'flex-col' : 'md:w-1/2'}`}>
                <div className={`flex flex-col gap-2 grow ${direction === "vertical" ? "mb-4" : ""}`}>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
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
                    <div className="flex items-center gap-2">
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
                    <Calendar mode="range" selected={range} onSelect={handleSelect} className="shadow rounded" disabled={unavailableDays} fromMonth={currentMonth} />
                </div>
            )}
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <UserRound size={20} />
                        <p>Guests</p>
                    </div>
                    <Input placeholder="Guests" type="number" max={maxGuests} />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <UserRound size={20} />
                        <p>Name</p>
                    </div>
                    <Input placeholder="Name" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Mail size={20} />
                        <p>Email</p>
                    </div>
                    <Input placeholder="Email" type="text" />
                </div>
            </div>

            <button
                onClick={handleSearch}
                className={`rounded-lg bg-primary h-10 text-white hover:bg-secondary ${direction === "vertical" ? '' : 'md:w-1/2'}`}
            >Book</button>
        </div>
    );
}

export default DateRangePicker;
