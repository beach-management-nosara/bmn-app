import type { APIRoute } from "astro";
import { db, eq, testimonials } from "astro:db";

export const GET: APIRoute = async () => {
    const results = await db.select().from(testimonials).where(eq(testimonials.show, true));

    return new Response(JSON.stringify(results), {
        headers: {
            "Content-Type": "application/json"
        }
    });
};
