import type { APIRoute } from "astro";
import { z } from "zod";

import { type Options, sendEmail } from "@/lib/email";
import { db, testimonials } from "astro:db";

const contactFormSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    subject: z.string().optional(),
    message: z.string(),
    property: z.string(),
    agreeToTerms: z.boolean().optional(),
    image: z.string().optional(),
    type: z.union([z.literal("contact"), z.literal("testimonial")])
});

type ContactForm = z.infer<typeof contactFormSchema>;

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const body: ContactForm = await request.json();

    try {
        // validate the request body
        const result = contactFormSchema.safeParse(body);
        if (!result.success) throw new Error("Invalid request body");

        // send the email
        const emailOptions: Options = {
            from: body.email,
            subject: body.subject || "Testimonial Form Submission",
            message: body.message,
            propertyName: body.property,
            formType: body.type,
            name: body.name
        };

        const { data, error } = await sendEmail(emailOptions);
        if (error) throw new Error("An error occurred while sending the email");

        // If the form is of type "testimonial", we can insert the data into the database here
        if (body.type === "testimonial") {
            await db.insert(testimonials).values({
                author: body.name,
                property: body.property,
                comments: body.message,
                consent: body.agreeToTerms
            });
        }

        return new Response(
            JSON.stringify({ success: true, message: "Form submitted successfully", data }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error("=> Error in contact form submission:", error);
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
};
