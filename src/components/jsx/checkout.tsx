import { useEffect, useState } from "react";
import {
    LoaderCircle,
    Mail,
    Phone,
    UserRound,
    Users,
    XIcon,
    Calendar as CalendarIco
} from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { usePropertyDetails } from "@/hooks/usePropertyDetails";
import { formatCurrency, formatToApiDate, validateEmail } from "@/lib/utils";
import type { AvailabilityData, DateRange, PriceType, RoomType } from "@/types";

import { Input } from "../ui/input";
import { SomethingWrongPage } from "./something-wrong";

type Status = "" | "loading" | "success" | "error" | "Invalid date";
type FormError = "" | "required" | "invalid";
type QuoteDataSimple = {
    total_scheduled_payments: number
    room_type: RoomType
}

export function Checkout({
    slug,
    periodStartString,
    periodEndString,
    originalGuests
}: {
    slug: string | null;
    periodStartString: string | null;
    periodEndString: string | null;
    originalGuests: string | null;
}) {
    const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [guests, setGuests] = useState(1);
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState<Status>("");
    const [errorMessage, setErrorMessage] = useState<Status>("");
    const [formError, setFormError] = useState<FormError>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
    const [rangeError, setRangeError] = useState<boolean>(false);
    const [agreement, setAgreement] = useState<boolean>(false);
    const [quote, setQuote] = useState<QuoteDataSimple | null>(null);

    const { toast } = useToast();

    if (slug == null || slug == "") {
        return <SomethingWrongPage />;
    }

    const {
        property,
        room,
        rate,
        isLoading: rateLoading
    } = usePropertyDetails(slug, range.from, range.to);

    const handleSearch = async () => {
        if (!range.from || !range.to) {
            setFormError("required");
            throw new Error("Date range incomplete");
        }

        if (!name || !email || !guests || !phone) {
            setFormError("required");
            throw new Error("Form incomplete");
        }

        if (!validateEmail(email)) {
            setFormError("invalid");
            throw new Error("Invalid email");
        }

        setFormError("");

        const periodStart = formatToApiDate(range.from);
        const periodEnd = formatToApiDate(range.to);

        if (periodStart === "Invalid Date" || periodEnd === "Invalid date") {
            setErrorMessage("Invalid date");
            toast({
                title: "Uh oh! Invalid date",
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

                const parsedResponse = await response.json();

                if (parsedResponse.error) {
                    setErrorMessage(parsedResponse.error);
                    setStatus("");
                    return;
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

    const handleGoBack = () => {
        window.history.back();
    };

    const fetchQuote = async () => {
        if (!range.from || !range.to || !room?.id) return;

        const arrival = formatToApiDate(range.from);
        const departure = formatToApiDate(range.to);
        const roomId = room.id;

        if (arrival == null || departure == null) {
            throw new Error("Invalid date range");
        }

        if (roomId == null || guests == null) {
            throw new Error("Incomplete info");
        }

        try {
            const response = await fetch(
                `/api/quote.json?propertyId=${property?.id}&arrival=${encodeURIComponent(arrival)}&departure=${encodeURIComponent(departure)}&roomId=${roomId}&guests=${guests}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch quote");
            }

            const quoteData = await response.json() as { data: QuoteDataSimple };

            if (quoteData.data) {
                setQuote(quoteData.data);
            }

        } catch (error) {
            console.error("Error fetching quote:", error);
        }
    };

    useEffect(() => {
        fetchQuote();
    }, [range.to, range.from, room?.id, guests]);

    useEffect(() => {
        const periodStartDate = periodStartString ? new Date(periodStartString) : undefined;
        const periodEndDate = periodEndString ? new Date(periodEndString) : undefined;

        // Set the state with the obtained Date objects
        setRange({ from: periodStartDate, to: periodEndDate });
        setGuests(parseInt(originalGuests ?? "0", 10));
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
        <div className="flex flex-col lg:flex-row-reverse">
            <div className="top-20 m-4 h-fit rounded bg-white p-5 shadow-lg lg:sticky">
                {status === "loading" && (
                    <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center gap-4 rounded bg-gray-200 bg-opacity-50">
                        <LoaderCircle className="animate-spin" />
                        <p>Loading</p>
                    </div>
                )}

                <div className="mb-4 flex items-center gap-4">
                    {property?.image_url ? (
                        <img
                            src={property?.image_url}
                            alt="property image"
                            className="h-12 w-12 rounded"
                        />
                    ) : (
                        <div className="h-12 w-12 animate-pulse rounded bg-gray-200" />
                    )}
                    {property?.name ? (
                        <p className="text-primary">{property?.name}</p>
                    ) : (
                        <div className="inline-block h-4 w-16 animate-pulse rounded bg-gray-200" />
                    )}
                </div>

                <h2 className="mb-4 border-b pb-4 text-xl font-bold">Booking summary</h2>

                <div className="mb-4 border-b pb-4">

                    <ul className="mt-2 list-disc text-gray-700">
                        {quote?.room_type.price_types.filter((priceType: PriceType) => priceType.subtotal > 0).map((priceType: PriceType) => (
                            <li key={priceType.type} className="flex flex-col justify-between list-none pb-4">
                                <div className="flex justify-between">
                                    <p className="flex-1">{priceType.description}</p>
                                    <span className="flex-1 text-right">{formatCurrency(priceType.subtotal, 2)}</span>
                                </div>
                                {priceType.type !== 0 && priceType.prices.length > 0 && (
                                    <ul className="ml-4 mt-1 list-disc text-gray-400">
                                        {priceType.prices.map((fee) => (
                                            <li key={fee.uid} className="flex justify-between list-none">
                                                <p className="flex-1">{fee.description}</p>
                                                <span className="flex-1 text-right">{formatCurrency(fee.amount, 2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>


                    <div className="border-b" />

                    <div className="flex justify-between text-xl font-bold text-primary mt-4 items-center">
                        <span className="text-sm text-muted">TOTAL</span>
                        <span>
                            <span className="text-sm">{property?.currency_code} </span>
                            {!quote?.total_scheduled_payments || rangeError ? (
                                <div className="inline-block h-4 w-16 animate-pulse rounded bg-gray-200" />
                            ) : (
                                <span>{formatCurrency(quote.total_scheduled_payments)}</span>
                            )}
                        </span>
                    </div>

                    <p>
                        <small>
                            *To avoid the credit card processing fee, you may opt to make your
                            payment via wire transfer.
                        </small>
                    </p>
                </div>

                {rangeError && !rateLoading && (
                    <p>
                        <small className="text-red-400">
                            Minimum stay is {rate?.min_stay} nights.
                        </small>
                    </p>
                )}

                <div className="mb-4 flex grow">
                    <div className={"flex grow flex-col gap-2"}>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <CalendarIco size={20} />
                                <p>Check In</p>
                            </div>
                        </div>
                        <button
                            className={
                                "h-10 w-full rounded-l border px-2 py-2 text-left text-sm text-muted"
                            }
                            disabled
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
                            disabled
                            className={`h-10 w-full rounded-r border px-2 py-2 text-left text-sm text-muted`}
                        >
                            {range.to ? range.to.toLocaleDateString() : "Add end date"}
                        </button>
                    </div>
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
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Phone size={20} />
                                <p>Phone</p>
                            </div>
                            <Input
                                placeholder="Phone"
                                type="number"
                                onChange={event => {
                                    setPhone(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>

                {formError === "required" && (
                    <p>
                        <small className="text-red-400">Please complete all fields</small>
                    </p>
                )}
                {status === "error" && (
                    <p>
                        <small className="text-red-400">
                            There was an error creating the booking, please try again or contact us
                            at{" "}
                            <a href="mailto:info@beachmanagementnosara.com" className="underline">
                                info@beachmanagementnosara.com
                            </a>
                        </small>
                    </p>
                )}
                {errorMessage && (
                    <p>
                        <small className="text-red-400">{errorMessage}</small>
                    </p>
                )}

                <p className="my-4 text-sm">
                    Get in touch with Beach Management Nosara to plan your trip or ask any
                    questions.
                </p>

                {isModalOpen && (
                    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-90">
                        <div
                            className="flex flex-col justify-between rounded-lg bg-white p-4"
                            style={{ width: "50vw" }}
                        >
                            <div className="flex flex-col">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        window.location.href = "/homes";
                                    }}
                                    className="mb-2 self-end"
                                >
                                    <XIcon />
                                </button>
                                <h2 className="mb-4 text-xl font-bold">Congratulations! 🎉</h2>
                                <p className="mb-6 text-base">
                                    You have made your booking request!
                                </p>
                                <p className="mb-6 text-sm text-gray-600">
                                    We will review your request and you will receive a confirmation,
                                    along with a quote and instructions for making payments in your
                                    email. If you don't receive them, please contact us at{" "}
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
                                onClick={() => {
                                    setIsModalOpen(false);
                                    window.location.href = "/homes";
                                }}
                                className="mt-4 h-10 w-full rounded-lg bg-primary font-bold text-white hover:bg-secondary"
                            >
                                Understood!
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="top-20 m-4 h-fit rounded bg-white p-5 shadow-lg">
                <h2 className="mb-4 text-2xl font-bold">Payment details</h2>
                <div className="mb-6 rounded-lg bg-amber-100  p-4">
                    <p className="text-secondary">
                        <strong>Payment upon confirmed reservation</strong>
                        <br />
                        No payment will be processed until your reservation is confirmed. We will
                        send you an email with your reservation updates.
                    </p>
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold">Cancellation policy</h3>
                    <ul className="ml-5 mt-2 list-disc text-gray-600">
                        <li>
                            100% of paid prepayments refundable when canceled 75 days before arrival
                            or earlier.
                        </li>
                        <li>0% refundable if canceled after.</li>
                    </ul>
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold">Security deposit policy</h3>
                    <p className="mt-2 text-gray-600">
                        A pre-authorization is held before arrival and voided after departure. You
                        will receive more details in your email shortly after requesting to book.
                    </p>
                </div>
                <div className="mb-4">
                    <input
                        type="checkbox"
                        id="agreement"
                        className="mr-2 outline-none"
                        onChange={() => setAgreement(prev => !prev)}
                    />
                    <label htmlFor="agreement" className="text-sm">
                        I have read and I accept the{" "}
                        <button onClick={() => setIsAgreementModalOpen(true)} className="underline">
                            Rental agreement
                        </button>
                        .
                    </label>
                </div>

                <div className="flex gap-4">
                    <button
                        className="rounded-lg bg-gray-400 px-4 py-2 font-bold text-white hover:bg-secondary"
                        onClick={handleGoBack}
                    >
                        Return to property
                    </button>
                    <button
                        onClick={handleSearch}
                        className="rounded-lg bg-primary px-4 py-2 font-bold text-white hover:bg-secondary disabled:bg-gray-300"
                        disabled={rateLoading || status === "loading" || rangeError || !agreement}
                    >
                        Request to book
                    </button>
                </div>

                {isAgreementModalOpen && (
                    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-90">
                        <div className="flex flex-col">
                            <div
                                className="flex w-full max-w-4xl flex-col justify-between rounded-lg bg-white p-4"
                                style={{ maxHeight: "80vh", overflowY: "auto" }}
                            >
                                <button
                                    onClick={() => setIsAgreementModalOpen(false)}
                                    className="mb-2 self-end"
                                >
                                    <XIcon />
                                </button>
                                {property?.agreement_text ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: property?.agreement_text
                                        }}
                                    />
                                ) : (
                                    <span>
                                        There was an error! Please contact us at{" "}
                                        <a
                                            href="mailto:info@beachmanagementnosara.com"
                                            className="underline"
                                        >
                                            info@beachmanagementnosara.com
                                        </a>{" "}
                                        so we can finalize your reservation.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
