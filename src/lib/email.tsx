import { Resend } from "resend";

import { EmailTemplate } from "./templates";

const { RESEND_API_KEY, EMAIL_RECEIVER, EMAIL_SENDER } = import.meta.env;

const resend = new Resend(RESEND_API_KEY);

export type Options = {
    name: string;
    from: string;
    subject: string;
    message: string;
    html?: string;
    formType: "contact" | "testimonial";
    propertyName: string;
};

export async function sendEmail(options: Options) {
    const { name, from, subject, propertyName, message, formType } = options;

    const { data, error } = await resend.emails.send({
        from: EMAIL_SENDER,
        to: [EMAIL_RECEIVER],
        subject,
        react: (<EmailTemplate
            username={name}
            email={from}
            formType={formType}
            message={message}
            propertyName={propertyName}
            subject={subject}
        />)
    });

    return { data, error };
}
