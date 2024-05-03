import { db, testimonials } from "astro:db";

import testimonialsData from "../src/data/testimonials.json";

// https://astro.build/db/seed
export default async function seed() {
    for (const record of testimonialsData) {
        await db.insert(testimonials).values({
            author: record.name,
            property: record.property,
            comments: record.experience,
            consent: true,
            show: true
        });
    }
}
