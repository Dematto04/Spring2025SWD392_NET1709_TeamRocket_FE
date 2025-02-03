import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Schema validation
const formSchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Enter a valid phone number" }),
  experience: z.string().min(1, { message: "Experience is required" }),
  services: z.array(z.string()).min(1, { message: "Select at least one service" }),
  location: z.string().min(3, { message: "Enter your city and state" }),
  hourlyRate: z.string().min(1, { message: "Enter hourly rate" }),
  certifications: z.string().optional(),
  bio: z.string().optional(),
  availability: z.string().min(1, { message: "Select availability" }),
});

const servicesList = [
  "House Cleaning",
  "Laundry",
  "Deep Cleaning",
  "Cooking",
  "Pet Care",
  "Elderly Care",
];

export default function HousekeeperProfileForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      experience: "",
      services: [],
      location: "",
      hourlyRate: "",
      certifications: "",
      bio: "",
      availability: "",
    },
  });

  const handleSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mx-8 w-full max-w-4xl rounded-xl bg-card p-10 sm:p-12 md:p-16">
        <div className="flex flex-col items-center gap-6">
          {/* Form Fields */}
          <div className="grid w-full gap-6">
            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name">Full Name</Label>
                  <FormControl>
                    <Input {...field} id="name" placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <Input {...field} id="email" type="email" placeholder="example@mail.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Services Offered */}
            <FormField control={form.control} name="services" render={({ field }) => (
              <FormItem>
                <Label>Services Offered</Label>
                <div className="grid grid-cols-2 gap-4">
                  {servicesList.map((service) => (
                    <label key={service} className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value.includes(service)}
                        onCheckedChange={(checked) => {
                          checked
                            ? form.setValue("services", [...field.value, service])
                            : form.setValue("services", field.value.filter((s) => s !== service));
                        }}
                      />
                      <span>{service}</span>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )} />

            {/* Availability (Dropdown) */}
            <FormField control={form.control} name="availability" render={({ field }) => (
              <FormItem>
                <Label>Availability</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="weekends">Weekends Only</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
