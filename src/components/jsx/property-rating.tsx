import { StarIcon } from "lucide-react";

export function PropertyRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-2">{rating !== 0 ? (
            Array(Math.floor(rating)).fill(0).map((_, index) => (
                <StarIcon key={index} className="fill-white size-3 md:size-4" />
            ))
        ) : <small>Not Rated Yet</small>}</div>
    )
}