import { useEffect, useState } from "react";
import { LoaderCircle, Mail, UserRound, Users, XIcon } from "lucide-react";

import DateRangePicker from "./day-picker";
import { usePropertyDetails } from "@/hooks/usePropertyDetails";
import { formatToApiDate, validateEmail } from "@/lib/utils";
import type { AvailabilityData, DateRange } from "@/types";

import { Input } from "../ui/input";

type Status = "" | "loading" | "success" | "error";
type FormError = "" | "required" | "invalid";

export function BookingCard({ slug }: { slug: string }) {
    const { property, room } = usePropertyDetails(slug);
    const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [guests, setGuests] = useState(1);
    const [status, setStatus] = useState<Status>("");
    const [errorMessage, setErrorMessage] = useState<Status>("");
    const [formError, setFormError] = useState<FormError>("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = async () => {
        if (!range.from || !range.to) {
            setFormError("required");
            throw new Error("Date range incomplete");
        }

        if (!name || !email || !guests) {
            setFormError("required");
            throw new Error("Form incomplete");
        }

        if (!validateEmail(email)) {
            setFormError("invalid");
            throw new Error("Invalid email");
        }

        const periodStart = formatToApiDate(range.from);
        const periodEnd = formatToApiDate(range.to);

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

            if (allAvailable) {
                const response = await fetch(`/api/book.json`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        propertyId: property?.id,
                        roomTypeId: room?.id,
                        name,
                        email,
                        guests,
                        periodStart,
                        periodEnd
                    })
                });

                const parsedResponse = await response.json()

                if (parsedResponse.error) {
                    setErrorMessage(parsedResponse.error)
                    setStatus("");
                    return
                } else if (!parsedResponse.error && !response.ok) {
                    setStatus("error");
                    throw new Error("Network response was not ok on booking creation");
                }
            }

            setStatus("success");
            setIsModalOpen(true);
        } catch (error) {
            setStatus("error");
            console.error("Failed to create booking or quote", error);
        }
    };

    useEffect(() => {
        // Get the search parameters from the URL
        const searchParams = new URLSearchParams(window.location.search);
        const periodStartString = searchParams.get('periodStart');
        const periodEndString = searchParams.get('periodEnd');

        // Convert the strings to Date objects
        const periodStartDate = periodStartString ? new Date(periodStartString) : undefined;
        const periodEndDate = periodEndString ? new Date(periodEndString) : undefined;

        // Set the state with the obtained Date objects
        setRange({ from: periodStartDate, to: periodEndDate });
    }, []);

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
                        <span className="text-sm text-muted">FROM </span>
                        <span className="text-sm">{property?.currency_code} </span>
                        {Math.round(property?.min_price ?? 0) * 7}
                        {" "}/{" "}
                        <span className="text-sm">
                            week
                        </span>
                    </span>
                </div>

                <div className="py-6">
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
                                const guests = parseInt(event.target.value, 10);
                                if (guests > 0) {
                                    setGuests(guests);
                                }
                            }}
                        />


                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <UserRound size={20} />
                            <p>Name</p>
                        </div>
                        <Input
                            placeholder="Name"
                            type="text"
                            onChange={event => setName(event.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Mail size={20} />
                            <p>Email</p>
                        </div>
                        <Input
                            placeholder="Email"
                            type="text"
                            onChange={event => setEmail(event.target.value)}
                        />
                        {formError === "invalid" && (
                            <small className="text-red-400">Invalid email</small>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleSearch}
                    className="mt-4 h-10 w-full rounded-lg bg-primary font-bold text-white hover:bg-secondary"
                    disabled={status === "loading"}
                >
                    Book
                </button>
                {formError === "required" && (
                    <p>
                        <small className="text-red-400">Please complete all fields</small>
                    </p>
                )}
                {status === "error" && (
                    <p>
                        <small className="text-red-400">
                            There was an error creating the booking, please try again or contact us at{" "}
                            <a href="mailto:info@beachmanagementnosara.com" className="underline">
                                info@beachmanagementnosara.com
                            </a>
                        </small>
                    </p>
                )}
                {errorMessage && (
                    <p>
                        <small className="text-red-400">
                            {errorMessage}
                        </small>
                    </p>
                )}

                <p className="my-4 text-sm">
                    Get in touch with Beach Management Nosara to plan your trip or ask any
                    questions.
                </p>
            </div>

            {isModalOpen && (
                <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-90">
                    <div
                        className="flex flex-col justify-between rounded-lg bg-white p-4"
                        style={{ width: "50vw" }}
                    >
                        <div className="flex flex-col">
                            <button onClick={() => setIsModalOpen(false)} className="mb-2 self-end">
                                <XIcon />
                            </button>
                            <h2 className="mb-4 text-xl font-bold">Congratulations! 🎉</h2>
                            <p className="mb-6 text-base">You have made your booking request!</p>
                            <p className="mb-6 text-sm text-gray-600">
                                We will review your request and you will receive a confirmation, along with a quote and instructions
                                for making payments in your email. If you don't receive them,
                                please contact us at{" "}
                                <a
                                    href="mailto:info@beachmanagementnosara.com"
                                    className="text-primary"
                                >
                                    info@beachmanagementnosara.com
                                </a>
                                .
                            </p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 h-10 w-full rounded-lg bg-primary font-bold text-white hover:bg-secondary"
                        >
                            Understood!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
