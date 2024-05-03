import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Loader2Icon, SendIcon } from 'lucide-react'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useProperties } from "@/hooks/useProperties"
import { cn } from "@/lib/utils"
import { useFormSubmit } from "@/hooks/useFormSubmit"

const formSchema = z.object({
    name: z.string({ required_error: "Your name is required" }).min(2).max(50),
    email: z.string({ required_error: "Your email is required" }).email(),
    property: z.string({ required_error: "Property is required" }),
    message: z.string({ required_error: "Message is required" }).min(10, { message: 'Message should be at least 10 characters long' }).max(1500),
    image: z.string().optional(),
    agreeToTerms: z.boolean().default(false)
})

type FormInput = z.infer<typeof formSchema>

export function TestimonialsForm() {
    const { submitForm, submitting } = useFormSubmit<FormInput>('testimonial')
    const { propertiesSimple } = useProperties()

    const form = useForm<FormInput>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            property: "",
            message: "",
        }
    })

    async function onSubmit(values: FormInput) {
        const image = propertiesSimple.find(p => p.name === values.property)?.image ?? undefined
        const success = await submitForm({ ...values, image })

        if (success) form.reset()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="my-6 space-y-6">
                <div className="flex flex-col items-center gap-6 lg:flex-row">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="font-semibold">Name*</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="font-semibold">Name*</FormLabel>
                                <FormControl>
                                    <Input placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="property"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="font-semibold">Property*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a house" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {propertiesSimple?.map(property => (
                                        <SelectItem key={property.id} value={property.name}>{property.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold">Add your comments*</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Your message..." {...field} rows={5} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-3">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        I have read, understand and agreed as indicated below
                                    </FormLabel>
                                </div>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <article className="prose-sm rounded-lg border p-4 text-gray-700/90">
                    <h3 className="font-semibold text-gray-700">Consent Agreement</h3>
                    <p>
                        I understand my review and testimonial may be used by Beach Management Nosara in
                        connection with its marketing, publicizing and promotions. I authorize and grant Beach
                        Management Nosara, its representatives and employees, the right to use my name,
                        photograph, and testimonial in various marketing initiatives.
                    </p>
                    <p>
                        I further understand that this information may be used in various mediums (print or
                        electronic formats) for such purposes as publicity, illustration, advertising and Web
                        content. Lastly, I waive any right to inspect or approve the finished product wherein my
                        likeness or my testimony appears.
                    </p>
                </article>

                <Button type="submit" className={cn("font-semibold", submitting && 'px-16')} disabled={submitting}>
                    {submitting ? <Loader2Icon className="animate-spin size-5" /> : (
                        <>
                            <SendIcon className="mr-2 size-5" />
                            Send Message
                        </>
                    )}
                </Button>
            </form>
        </Form>
    )
}