
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { getDigitalId, type DigitalIdSerializable } from '@/lib/digital-id';
import { generateDigitalId } from '@/ai/flows/generate-digital-id';
import { DigitalIdCard } from '@/components/digital-id-card';


const idFormSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters."),
    documentType: z.string({ required_error: "Please select a document type." }),
    documentNumber: z.string().min(5, "Document number seems too short."),
    nationality: z.string().min(2, "Please enter your nationality."),
    visitStartDate: z.date({ required_error: "A start date is required." }),
    visitEndDate: z.date({ required_error: "An end date is required." }),
    itinerary: z.string().optional(),
}).refine(data => data.visitEndDate > data.visitStartDate, {
    message: "End date must be after start date.",
    path: ["visitEndDate"],
});

type IdFormValues = z.infer<typeof idFormSchema>;

function CreateDigitalIdForm({ onIdCreated }: { onIdCreated: (id: DigitalIdSerializable) => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<IdFormValues>({
        resolver: zodResolver(idFormSchema),
        defaultValues: {
            fullName: "",
            documentNumber: "",
            nationality: "",
            itinerary: "",
            documentType: undefined,
            visitStartDate: undefined,
            visitEndDate: undefined,
        },
        mode: "onChange",
    });

    async function onSubmit(data: IdFormValues) {
        setIsSubmitting(true);
        try {
            const newId = await generateDigitalId({
                fullName: data.fullName,
                documentNumber: data.documentNumber,
                documentType: data.documentType,
                nationality: data.nationality,
                visitStartDate: data.visitStartDate.toISOString(),
                visitEndDate: data.visitEndDate.toISOString(),
                itinerary: data.itinerary,
            });
            toast({ title: "Digital ID Generated", description: "Your secure digital ID has been created." });
            onIdCreated(newId);
        } catch (error) {
            console.error("Failed to generate Digital ID:", error);
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: "There was an error creating your ID. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Generate Your Digital Tourist ID</CardTitle>
                        <CardDescription>This secure ID is valid for the duration of your visit and helps authorities assist you faster.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name (as on document)</FormLabel>
                                    <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="documentType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Document Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a document type" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Passport">Passport</SelectItem>
                                                <SelectItem value="Aadhaar">Aadhaar Card</SelectItem>
                                                <SelectItem value="National ID">Other National ID</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="documentNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Document Number</FormLabel>
                                        <FormControl><Input placeholder="e.g., A12345678" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={form.control}
                            name="nationality"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nationality</FormLabel>
                                    <FormControl><Input placeholder="e.g., Indian" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <FormField
                                control={form.control}
                                name="visitStartDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Visit Start Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="visitEndDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Visit End Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="itinerary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Planned Itinerary (Optional)</FormLabel>
                                    <FormControl><Textarea placeholder="Briefly describe your travel plans (e.g., cities, hotels)." {...field} /></FormControl>
                                    <FormDescription>This can help authorities locate you in an emergency.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="animate-spin" />}
                                {isSubmitting ? "Generating..." : "Generate My ID"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}


export default function DigitalIdPage() {
    const [digitalId, setDigitalId] = useState<DigitalIdSerializable | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchId = async () => {
            setIsLoading(true);
            try {
                const id = await getDigitalId();
                setDigitalId(id);
            } catch (error) {
                console.error("Could not fetch digital ID", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchId();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto">
            {digitalId ? (
                <div>
                     <div className="mb-8">
                        <h1 className="text-3xl font-bold font-headline">Your Digital Tourist ID</h1>
                        <p className="text-muted-foreground">
                            Present this ID to authorities when required. It is cryptographically secure.
                        </p>
                    </div>
                    <DigitalIdCard digitalId={digitalId} />
                </div>
            ) : (
                <CreateDigitalIdForm onIdCreated={setDigitalId} />
            )}
        </div>
    );
}
