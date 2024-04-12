import { useState } from "react";

import { useToast } from "@/components/ui/use-toast";

export function useFormSubmit<T>(formType: "contact" | "testimonial" = "contact") {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const { toast } = useToast();

    async function submitForm(values: T) {
        setSubmitting(true);
        let success = false;

        try {
            const res = await fetch("/api/contact.json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...values, type: "contact" })
            });

            if (!res.ok) throw new Error("Failed to send message");

            const data = await res.json();

            if (data.error) throw new Error(data.error);
            if (data.success) {
                toast({
                    title: "Message sent successfully",
                    description: `We have received your ${formType === "testimonial" ? "feedback" : "message"} and will get back to you soon.`
                });
                success = true;
            }
        } catch (error) {
            console.error("=> Error: ", error);
            toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem sending your message. Please try again later"
            });
            success = false;
        } finally {
            setSubmitting(false);
            return success;
        }
    }

    return { submitting, submitForm };
}
