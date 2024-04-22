import { usePropertyDetails } from "@/hooks/usePropertyDetails";
import DateRangePicker from "./day-picker";

export function BookingCard({ slug }: { slug: string }) {
    const { property, room } = usePropertyDetails(slug);

    return (
        <div className="sticky top-20 m-4 h-fit rounded bg-white p-5 shadow-lg">
            <div className="border-b pb-4">
                <span className="text-xl font-bold text-primary">
                    <span className="text-sm text-muted">FROM{' '}</span>
                    <span className="text-sm">{property?.currency_code}{' '}</span>
                    {Math.round(room?.min_price ?? 0)} / {
                        room?.price_unit_in_days === 0 ? "" : room?.price_unit_in_days
                    }
                    <span className="text-sm">
                        {
                            room?.price_unit_in_days === 7
                                ? "week"
                                : room?.price_unit_in_days === 0
                                    ? "day"
                                    : "days"
                        }
                    </span>
                </span>
            </div>

            <div className="py-6">
                <DateRangePicker direction="vertical" />
            </div>

            <button
                className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-secondary"
            >
                Search
            </button>
            <p className="my-4 text-sm">
                Get in touch with Beach Management Nosara to plan your trip or ask any
                questions.
            </p>
        </div>
    )
}