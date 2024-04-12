import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useProperties } from "@/hooks/useProperties"

const SELECT_OPTIONS = [
    'Qualify as BMN Property',
    'Plan my vacation',
    'Inquiries',
    'Other',
]

const formSchema = z.object({
    name: z.string({ required_error: "Your name is required" }).min(2).max(50),
    email: z.string({ required_error: "Your email is required" }).email(),
    subject: z.string().optional(),
    property: z.string({ required_error: "Property is required" }),
    message: z.string({ required_error: "Message is required" }).min(10).max(1500),
})

type FormInput = z.infer<typeof formSchema>

export function ContactForm() {
    const { propertiesSimple } = useProperties()

    const form = useForm<FormInput>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            property: "",
            message: "",
        }
    })

    async function onSubmit(values: FormInput) {
        console.log("🚀 ~ onSubmit ~ values:", values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="my-6 space-y-3">
                <div className="flex flex-col items-center gap-6 lg:flex-row">
                    <div className="w-full">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Name*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-full">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Name*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="font-semibold">Subject*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a subject" />
                                            </SelectTrigger>
                                        </FormControl>
                                    </FormControl>
                                    <SelectContent>
                                        {SELECT_OPTIONS.map(option => (
                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="property"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="font-semibold">Property*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a house" />
                                            </SelectTrigger>
                                        </FormControl>
                                    </FormControl>
                                    <SelectContent>
                                        {propertiesSimple.map(property => (
                                            <SelectItem key={property.id} value={property.name}>{property.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold">Add your comments*</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Your message" {...field} rows={5} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="font-semibold">Submit</Button>
            </form>
        </Form>
    )
}