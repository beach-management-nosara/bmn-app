import { useEffect, useState } from "react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import type { Review, ReviewsResponse } from "@/types";
import { MaxWidthContainer } from "./max-width-container";

const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
        <>
            {"★".repeat(fullStars)}
            {"☆".repeat(emptyStars)}
        </>
    );
};

const ReviewCard = ({ review }: { review: Review }) => (
    <div className="mb-4 rounded-lg border border-gray-200 p-4 shadow-lg h-full">
        <div className="mb-2 flex items-center justify-between font-semibold capitalize">
            <div className="mb-2">{review.author.toLowerCase()}</div>
            <div className="text-yellow-500">{renderStars(review.rating)}</div>
        </div>
        <div className="mb-2 text-xl font-bold text-primary">{review.title}</div>
        <div className="my-4 whitespace-pre-wrap">{review.text}</div>
        {review.ownerComment && (
            <div className="my-6 ml-16 rounded-sm border-l-4 border-gray-500 bg-gray-600 p-3">
                <div>{review.ownerComment}</div>
                <div className="mt-2 text-right italic">
                    <small>
                        Beach Management Nosara{" "}
                        {new Date(review.ownerCommentDate!).toLocaleString()}
                    </small>
                </div>
            </div>
        )}
        <div className="text-right text-sm text-gray-600">
            {review.guestType} | stayed on {review.stayDate}
        </div>
    </div>
);

const Reviews = ({ propertyId }: { propertyId: string }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(
                    `https://websiteserver.lodgify.com/v2/websites/reviews/website/280872/property/${propertyId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                const res = (await response.json()) as ReviewsResponse;
                setReviews(res.reviews);
            } catch (error) {
                console.error("Error fetching reviews");
            } finally {
                setLoading(false);
            }
        };

        if (propertyId) {
            fetchReviews();
        }
    }, [propertyId]);

    if (loading) {
        return (
            <div className="mb-2">
                <div className="mb-2 h-4 w-12 animate-pulse rounded bg-gray-200" />
                <div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            </div>
        );
    }

    if (!reviews.length) return null;

    return (
        <MaxWidthContainer>
            <h2 className="mb-4 text-3xl font-bold">Reviews</h2>

            <div className='px-10'>
                <Carousel>
                    <CarouselContent>
                        {reviews.map((review, index) => (
                            <CarouselItem key={index}>
                                <ReviewCard
                                    key={review.reviewDate + review.stayDate + index}
                                    review={review}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </MaxWidthContainer>
    );
};

export default Reviews;