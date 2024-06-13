import { useEffect, useState } from "react";
import { LoaderCircle, Users } from "lucide-react";

import DateRangePicker from "./day-picker";
import { usePropertyDetails } from "@/hooks/usePropertyDetails";
import { formatToApiDate, validateEmail } from "@/lib/utils";
import type { AvailabilityData, DateRange } from "@/types";

import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

type Status = "" | "loading" | "success" | "error";
type FormError = "" | "required" | "invalid";

export function BookingCard({ slug }: { slug: string }) {
    const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });
    const [guests, setGuests] = useState<number | undefined>(2);
    const [status, setStatus] = useState<Status>("");
    const [formError, setFormError] = useState<FormError>("");
    const [rangeError, setRangeError] = useState<boolean>(false); // State for range error

    const { toast } = useToast();

    const {
        property,
        room,
        rate,
        isLoading: rateLoading
    } = usePropertyDetails(slug, range.from, range.to);

    const handleSearch = async () => {
        if (!range.from || !range.to) {
            setFormError("required");
            toast({
                title: "Uh oh! Date range incomplete"
            });
            return;
        }

        if (!guests) {
            setFormError("required");
            toast({
                title: "Uh oh! Select a number of guests"
            });
            return;
        }

        setFormError("");

        const periodStart = formatToApiDate(range.from);
        const periodEnd = formatToApiDate(range.to);

        if (periodStart === "Invalid Date" || periodEnd === "Invalid date") {
            toast({
                title: "Uh oh! Invalid date"
            });
            throw new Error("Invalid Date");
        }

        try {
            setStatus("loading");
            const response = await fetch(
                `/api/availability/${property?.id}.json?periodStart=${encodeURIComponent(periodStart)}&periodEnd=${encodeURIComponent(periodEnd)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                setStatus("error");
                throw new Error("Network response was not ok on availability");
            }

            const availabilityData = (await response.json()) as AvailabilityData;

            const allAvailable = availabilityData.data[0]?.periods.every(
                period => period.available === 1
            );

            if (allAvailable && property?.id != null) {
                const url = `/checkout?propertyId=${property?.id}&periodStart=${encodeURIComponent(periodStart)}&periodEnd=${encodeURIComponent(periodEnd)}&guests=${guests}`;
                window.location.href = url;
                setStatus("success");
            } else {
                setStatus("error");
                toast({
                    title: "Uh oh! The property is not available on these dates"
                });
                return
            }

        } catch (error) {
            setStatus("error");
            console.error("Failed to confirm availability", error);
        }
    };

    useEffect(() => {
        // Get the search parameters from the URL
        const searchParams = new URLSearchParams(window.location.search);
        const periodStartString = searchParams.get("periodStart");
        const periodEndString = searchParams.get("periodEnd");

        // Convert the strings to Date objects
        const periodStartDate = periodStartString ? new Date(periodStartString) : undefined;
        const periodEndDate = periodEndString ? new Date(periodEndString) : undefined;

        // Set the state with the obtained Date objects
        setRange({ from: periodStartDate, to: periodEndDate });
    }, []);

    useEffect(() => {
        if (!range.to || !range.from || !rate?.min_stay) return;

        const differenceInTime = range.to.getTime() - range.from.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        if (differenceInDays < rate?.min_stay) {
            setRangeError(true);
            return;
        } else {
            setRangeError(false);
        }
    }, [range.to, range.from, rate?.min_stay]);

    return (
        <div className="relative">
            <div className="sticky top-20 m-4 h-fit rounded bg-white p-5 shadow-lg">
                {status === "loading" && (
                    <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center gap-4 rounded bg-gray-200 bg-opacity-50">
                        <LoaderCircle className="animate-spin" />
                        <p>Loading</p>
                    </div>
                )}

                <div className="border-b pb-4">
                    <span className="text-xl font-bold text-primary">
                        <span className="text-sm text-muted">
                            {!range.from || !range.to ? "FROM" : "PRICE"}{" "}
                        </span>
                        <span className="text-sm">{property?.currency_code} </span>

                        {!rate?.price || rangeError ? (
                            <div className="inline-block h-4 w-16 animate-pulse rounded bg-gray-200" />
                        ) : (
                            <span>{Math.round(rate.price)}</span>
                        )}

                        {!range.from || !range.to ? (
                            <>
                                <span> / </span>
                                <span className="text-sm">week</span>
                            </>
                        ) : (
                            ""
                        )}
                    </span>
                </div>

                {rangeError && !rateLoading && (
                    <p>
                        <small className="text-red-400">
                            Minimum stay is {rate?.min_stay} nights.
                        </small>
                    </p>
                )}

                <div className={!rangeError ? "py-6" : ""}>
                    <DateRangePicker
                        direction="vertical"
                        propertyId={property?.id}
                        range={range}
                        setRange={setRange}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Users size={20} />
                            <p>Guests</p>
                        </div>
                        <Input
                            placeholder="Guests"
                            type="number"
                            max={room?.max_people}
                            value={guests}
                            onChange={event => {
                                const value = event.target.value;
                                if (value === "") {
                                    setGuests(undefined);
                                } else {
                                    const guests = parseInt(value, 10);
                                    if (guests > 0) {
                                        setGuests(guests);
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSearch}
                    className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-primary text-center font-bold text-white hover:bg-secondary disabled:bg-gray-400"
                    disabled={status === "loading" || rangeError || rateLoading}
                >
                    {rateLoading ? <LoaderCircle className="h-4 animate-spin" /> : "Confirm dates"}
                </button>
                {formError === "required" && (
                    <p>
                        <small className="text-red-400">Please complete all fields</small>
                    </p>
                )}
                {status === "error" && (
                    <p>
                        <small className="text-red-400">
                            There was an error confirming availability, please try again with different dates or contact
                            us at{" "}
                            <a href="mailto:info@beachmanagementnosara.com" className="underline">
                                info@beachmanagementnosara.com
                            </a>
                        </small>
                    </p>
                )}

                <p className="my-4 text-sm">
                    Get in touch with Beach Management Nosara to plan your trip or ask any
                    questions.
                </p>
            </div>
        </div>
    );
}
