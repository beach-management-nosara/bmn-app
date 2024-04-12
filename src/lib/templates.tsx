import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Text,
    Tailwind
} from "@react-email/components";

interface EmailTemplateProps {
    username: string;
    email: string;
    subject?: string;
    propertyName: string;
    message: string;
    formType: 'contact' | 'testimonial';
}

export function EmailTemplate(props: EmailTemplateProps) {
    const { username, email, subject, propertyName, message, formType } = props;

    return (
        <Html>
            <Head />
            <Preview>
                New {formType === 'contact' ? 'Contact' : 'Testimonial'} Submission from {username}
            </Preview>
            <Tailwind>
                <Body className="bg-white font-sans">
                    <Container className="mx-auto my-0 p-0">
                        <Img
                            src='/logo.png'
                            width="170"
                            height="50"
                            alt="Beach Management Nosara Logo"
                            className="mx-auto mt-0 mb-16"
                        />
                        <Text className="text-base leading-7 mx-0 my-0">
                            You have received a new {formType === 'contact' ? 'contact inquiry' : 'testimonial'} submission from:
                        </Text>
                        <Text className="text-base leading-7 mx-0 my-0">
                            <strong>Name:</strong> {username}
                            <br />
                            <strong>Email</strong>: {email}
                            <br />
                            {subject && <span><strong>Subject: </strong> {subject}</span>}
                            <br />
                            <strong>Property</strong>: {propertyName}
                            <br />
                            <strong>Message</strong>: {message}
                        </Text>
                        <Text className="text-base leading-7 mx-0 mt-16">
                            Best,
                            <br />
                            The Beach Management Nosara team
                        </Text>
                        <Hr className="border-gray-300 my-5 mx-0 w-full" />


                        <Text className="text-sm text-gray-500 leading-7 mx-0 my-0">
                            Please respond promptly to {formType === 'contact' ? 'address the inquiry' : 'acknowledge the feedback'}
                        </Text>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
};

