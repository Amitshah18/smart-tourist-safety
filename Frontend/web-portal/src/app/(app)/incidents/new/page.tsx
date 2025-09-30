
"use client";

import { useState, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createIncidentReport } from "@/ai/flows/create-incident-report";
import { Loader2, MapPin, Upload } from "lucide-react";
import { TrackingContext } from "@/context/tracking-provider";
import Image from "next/image";

const incidentFormSchema = z.object({
  type: z.string({ required_error: "Please select an incident type." }),
  severity: z.string({ required_error: "Please select a severity level." }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must not be longer than 500 characters."
  }),
  location: z.string().min(1, { message: "Location is required." }),
  media: z.any().optional(),
});

type IncidentFormValues = z.infer<typeof incidentFormSchema>;

export default function NewIncidentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { location: trackedLocation } = useContext(TrackingContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      description: "",
      location: "",
    },
    mode: "onChange",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select a file smaller than 4MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        form.setValue("media", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if (trackedLocation) {
        const locationString = `Lat: ${trackedLocation.latitude.toFixed(5)}, Lon: ${trackedLocation.longitude.toFixed(5)}`;
        form.setValue('location', locationString, { shouldValidate: true });
        setIsLocating(false);
        return;
    }

    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Location Error",
        description: "Geolocation is not supported by your browser.",
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
        form.setValue("location", locationString, { shouldValidate: true });
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Could not fetch location. Please grant permission.",
        });
        setIsLocating(false);
      }
    );
  };
  
  async function onSubmit(data: IncidentFormValues) {
    setIsSubmitting(true);
    try {
      const result = await createIncidentReport({
        type: data.type,
        severity: data.severity,
        description: data.description,
        location: data.location,
        mediaUrl: data.media,
      });

      if (result.success) {
        toast({
          title: "Report Submitted",
          description: "Your incident report has been created successfully.",
        });
        router.push("/incidents");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Failed to create incident report:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Report a New Incident</h1>
        <p className="text-muted-foreground">
          Fill out the details below to submit a new incident report.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>
                Provide as much information as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type of incident" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Theft">Theft</SelectItem>
                          <SelectItem value="Lost Item">Lost Item</SelectItem>
                          <SelectItem value="Medical">Medical Emergency</SelectItem>
                          <SelectItem value="Harassment">Harassment</SelectItem>
                          <SelectItem value="Suspicious Activity">Suspicious Activity</SelectItem>
                           <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a severity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                       <FormDescription>
                        Assess the immediate danger or impact.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the incident in detail..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                     <div className="flex gap-2">
                        <FormControl>
                            <Input placeholder="e.g., Corner of Main St and 1st Ave" {...field} />
                        </FormControl>
                        <Button type="button" variant="outline" onClick={handleGetCurrentLocation} disabled={isLocating}>
                            {isLocating ? <Loader2 className="animate-spin" /> : <MapPin />}
                            <span className="ml-2 hidden sm:inline">Get Current Location</span>
                        </Button>
                    </div>
                    <FormDescription>
                      Be as specific as possible, or use the location button.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                  <FormLabel>Attach Media (Optional)</FormLabel>
                  <FormControl>
                      <div className="relative flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted" onClick={() => fileInputRef.current?.click()}>
                          <Input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              onChange={handleFileChange}
                              accept="image/*,video/*"
                          />
                          {previewImage ? (
                              <Image src={previewImage} alt="Media preview" fill className="object-contain rounded-lg" />
                          ) : (
                              <div className="text-center text-muted-foreground">
                                  <Upload className="mx-auto h-10 w-10" />
                                  <p>Click to upload a photo or video</p>
                                  <p className="text-xs">Max file size: 4MB</p>
                              </div>
                          )}
                      </div>
                  </FormControl>
                  <FormMessage />
              </FormItem>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="animate-spin" />}
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
