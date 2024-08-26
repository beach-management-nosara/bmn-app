import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIco } from "lucide-react";
import type { SelectRangeEventHandler } from "react-day-picker";

import { Calendar } from "../ui/calendar";
import { formatToApiDate } from "@/lib/utils";
import type { AvailabilityData, DateRange } from "@/types";

type UnavailableDays = {
    from: Date;
    to: Date;
}[];

function DateRangePicker({
    direction = "horizontal",
    propertyId,
    range,
    setRange,
    setPropertyUnavailable,
    className
}: {
    direction?: "horizontal" | "vertical";
    propertyId?: string;
    range: DateRange;
    setRange: (range: DateRange) => void;
    setPropertyUnavailable?: (value: boolean) => void;
    className?: string
}) {
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

    const currentMonth = new Date();
    currentMonth.setDate(1); // Earliest month users can navigate to is current month
    const [unavailableDays, setUnavailableDays] = useState<UnavailableDays>([
        { from: currentMonth, to: new Date() }
    ]);

    const handleSelect: SelectRangeEventHandler = selectedRange => {
        if (setPropertyUnavailable) setPropertyUnavailable(false);
        if (!selectedRange || !selectedRange.from) return;

        // If both from and to dates are set, reset the range and start a new one
        if (range.from && range.to) {
            setRange({ from: undefined, to: undefined });
            return;
        }

        const newRange: DateRange = {
            from: selectedRange.from,
            to: selectedRange.to || undefined
        };

        setRange(newRange);

        if (selectedRange.to && selectedRange.from) {
            if (!isRangeValid(selectedRange.from, selectedRange.to, unavailableDays)) {
                return;
            }
            // Get the current search parameters from the URL
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set("periodStart", formatToApiDate(selectedRange.from));
            searchParams.set("periodEnd", formatToApiDate(selectedRange.to));

            // Update the URL with the new parameters
            window.history.pushState({}, "", `${window.location.pathname}?${searchParams}`);
        }
    };

    const isRangeValid = (rangeStart: Date, rangeEnd: Date, unavailableDays: UnavailableDays) => {
        const startTimestamp = rangeStart.getTime(); // Convert to timestamp
        const endTimestamp = rangeEnd.getTime(); // Convert to timestamp

        for (let day of unavailableDays) {
            const dayStartTimestamp = day.from.getTime(); // Convert to timestamp
            const dayEndTimestamp = day.to.getTime(); // Convert to timestamp

            // Now perform the comparison using timestamps
            if (dayStartTimestamp <= endTimestamp && dayEndTimestamp >= startTimestamp) {
                return false; // The selected range is invalid as it overlaps with an unavailable range
            }
        }
        return true; // The selected range is valid if it does not overlap with any unavailable ranges
    };

    useEffect(() => {
        // this happens only when searching for available places on certain dates
        if (!propertyId) return;

        const fetchAvailability = async () => {
            const now = new Date();
            const periodStart = formatToApiDate(now);

            const yearFromNow = new Date(now);
            yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);
            const periodEnd = formatToApiDate(yearFromNow);

            const response = await fetch(
                `/api/availability/${propertyId}.json?periodStart=${encodeURIComponent(periodStart)}&periodEnd=${encodeURIComponent(periodEnd)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            const availabilityData = (await response.json()) as AvailabilityData;

            // Map through periods and filter out any undefined values
            const newUnavailableDays = availabilityData.data[0].periods.reduce(
                (acc: { from: Date; to: Date }[], period) => {
                    if (period.available === 0) {
                        // Make dates UTC midnight
                        const from = new Date(period.start + "T00:00");
                        const to = new Date(period.end + "T00:00");
                        acc.push({ from, to });
                    }
                    return acc;
                },
                []
            );

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
        <div
            className={`relative flex grow gap-4 w-full ${direction === "vertical" ? "flex-col" : "flex-col md:flex-row md:items-end"}`}
            ref={calendarRef}
        >
            <div className={`flex grow gap-4 ${direction === "vertical" ? "flex-col" : "md:w-1/2"}`}>
                <div
                    className={`flex grow flex-col gap-2 ${direction === "vertical" ? "mb-4" : ""}`}
                >
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <CalendarIco size={20} />
                            <p>Check In</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setCalendarOpen(!isCalendarOpen)}
                        className={`h-10 w-full border px-2 py-2 text-left text-sm text-muted ${direction === "vertical" ? "rounded-md" : "rounded-md"}`}
                    >
                        {range.from ? range.from.toLocaleDateString() : "Add start date"}
                    </button>
                </div>

                <div className="flex grow flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <CalendarIco size={20} />
                        <p>Check Out</p>
                    </div>

                    <button
                        onClick={() => setCalendarOpen(true)}
                        className={`h-10 w-full border px-2 py-2 text-left text-sm text-muted ${direction === "vertical" ? "rounded-md" : "rounded-md"}`}
                    >
                        {range.to ? range.to.toLocaleDateString() : "Add end date"}
                    </button>
                </div>
            </div>

            {isCalendarOpen && (
                <div className="absolute z-10 bg-white">
                    <Calendar
                        mode="range"
                        selected={range}
                        onSelect={handleSelect}
                        className={`rounded shadow ${className}`}
                        disabled={unavailableDays}
                        fromMonth={currentMonth}
                    // footer={range.from && range.to && <small className="text-primary">Click another date to clear selection</small>}
                    />
                </div>
            )}
        </div>
    );
}

export default DateRangePicker;
