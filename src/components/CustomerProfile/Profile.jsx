import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(1, { message: "Username is required" }),
  phoneNumber: z.string().min(10, { message: "Invalid phone number" }),
  gender: z.enum(["Male", "Female", "Other"], { message: "Select a gender" }),
  dob: z.string().min(1, { message: "Date of birth is required" }),
});

const Profile = () => {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      FirstName: "Demo",
      lastName: "User",
      email: "demouser@gmail.com",
      username: "Demouser",
      phoneNumber: "+93 98765432103",
      gender: "Male",
      dob: "2007-01-02",
    },
  });

  const handleSubmit = (data) => {
    console.log("Profile Data:", data);
    toast({
      title: "Profile Updated Successfully!",
      description: "Your profile details have been saved.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 bg-white rounded-lg shadow-sm space-y-6">
        <h2 className="text-2xl font-bold">Profile Settings</h2>

        {/* General Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <h3 className="text-lg font-semibold mb-4">General Information</h3>
        <br></br>
          {Object.keys(formSchema.shape).slice(0, 7).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor={field.name}>{field.name.replace(/([A-Z])/g, " $1").trim()} *</Label>
                  <FormControl>
                    <Input {...field} id={field.name} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
