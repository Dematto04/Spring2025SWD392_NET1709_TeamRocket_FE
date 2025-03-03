import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useUpdateCustomerProfileMutation } from "@/redux/api/customerProfileApi";

const formSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  phoneNumber: z.string().min(10, { message: "Invalid phone number" }),
  gender: z.enum(["Male", "Female"], { message: "Select a gender" }),
  dob: z.string().optional(),
});

const Profile = ({ profileInfo }) => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState(null);
  const [updateProfile, { isLoading }] = useUpdateCustomerProfileMutation();

  const getTomorrowDate = (dateString) => {
    const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    utcDate.setUTCDate(utcDate.getUTCDate() );
    return utcDate.toISOString().split("T")[0];
  };
  // Transform API data to match form structure
  const defaultValues = profileInfo?.data
    ? {
        fullName: profileInfo.data.full_name || "",
        phoneNumber: profileInfo.data.phone || "",
        gender: profileInfo.data.gender ? "Male" : "Female", // Convert boolean to string
         dob: profileInfo.data.birth_date
        ? getTomorrowDate(profileInfo.data.birth_date)
        : "",
      }
    : {
        fullName: "",
        phoneNumber: "",
        gender: "Male",
        dob: "",
      };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (profileInfo?.data) {
      form.reset(defaultValues);
      setImagePreview(profileInfo.data.avatar); // Set avatar image preview
    }
  }, [profileInfo]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const getDateString = (dateString) => {
    if (!dateString) return "";
  
    const [year, month, day] = dateString.split("-").map(Number);
  
    const date = new Date(Date.UTC(year, month - 1, day));
  
    date.setUTCDate(date.getUTCDate());
  
    const formattedYear = date.getUTCFullYear();
    const formattedMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
    const formattedDay = String(date.getUTCDate()).padStart(2, "0");
  
    return `${formattedYear}-${formattedMonth}-${formattedDay}T00:00:00`;
  };
  
  const handleSubmit = async (data) => {
    try {
      // Convert gender if necessary (e.g., true for Male, false for Female)
      const formattedGender = data.gender === "Male" ? true : false;
  
      // Format phone number (remove non-digit characters)
      const formattedPhoneNumber = data.phoneNumber.replace(/\D/g, "");
  
      const formattedBirthdate = data.dob;

      const payload = {
          full_name: data.fullName,
          phone: formattedPhoneNumber,
          gender: formattedGender,
          birth_date: formattedBirthdate 
          // If the API expects the file itself (or a base64 string), you'll need to handle that conversion.
      };
  
      console.log("Sending Data:", payload); // Debug: log the payload
  
      const response = await updateProfile(payload).unwrap();
      console.log("Response:", response);
  
      toast({
        title: "Profile Updated Successfully!",
        description: "Your profile details have been saved.",
      });
    } catch (error) {
      console.error("Update Error:", error);
      console.error("Error Details:", error?.data?.errors);
  
      toast({
        title: "Update Failed",
        description: error?.data?.message || "Something went wrong!",
        variant: "destructive",
      });
    }
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
                <Label htmlFor="fullName">Full Name *</Label>
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
