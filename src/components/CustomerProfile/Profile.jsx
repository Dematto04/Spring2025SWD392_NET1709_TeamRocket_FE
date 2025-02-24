import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(10, { message: "Invalid phone number" }),
  gender: z.enum(["Male", "Female"], { message: "Select a gender" }),
  dob: z.string().min(1, { message: "Date of birth is required" }),
});

const Profile = () => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: "Male",
      dob: "",
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
        
        {/* Profile Picture */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500">Preview</span>
              )}
            </div>
            <div>
              <input type="file" id="profile-picture" className="hidden" onChange={handleImageChange} />
              <label
                htmlFor="profile-picture"
                className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
              >
                Choose File
              </label>
              <p className="text-sm text-gray-500 mt-2">
                *Image size should be less than 2MB. Allowed files: .png, .jpg, .jpeg.
              </p>
            </div>
          </div>
        </div>

        {/* General Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h3 className="text-lg font-semibold mb-4">General Information</h3>
          <br />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="firstName">Full Name *</Label>
                <FormControl>
                  <Input {...field} id="fullName" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="gender">Gender *</Label>
                <FormControl>
                  <select {...field} id="gender" className="border p-2 rounded-md w-full">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">Email *</Label>
                <FormControl>
                  <Input {...field} id="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <FormControl>
                  <Input {...field} id="phoneNumber" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="dob">Date of Birth *</Label>
                <FormControl>
                  <Input {...field} id="dob" type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
