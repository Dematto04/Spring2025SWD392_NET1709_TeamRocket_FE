import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  useUpdateCustomerProfileMutation,
  useUpdateProfileAvatarMutation 
} from "@/redux/api/customerProfileApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, UserCircle } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  phoneNumber: z.string().min(10, { message: "Invalid phone number" }),
  gender: z.enum(["Male", "Female"], { message: "Select a gender" }),
  dob: z.string().optional(),
});

const Profile = ({ profileInfo }) => {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [updateProfile, { isLoading }] = useUpdateCustomerProfileMutation();
  const [updateAvatar, { isLoading: isAvatarUploading }] = useUpdateProfileAvatarMutation();

  const getTomorrowDate = (dateString) => {
    const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    utcDate.setUTCDate(utcDate.getUTCDate());
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

  // Set avatar URL from profileInfo when it loads
  useEffect(() => {
    if (profileInfo?.data) {
      form.reset(defaultValues);
      
      // Set the avatar URL from the profile data
      if (profileInfo.data.avatar) {
        setAvatarUrl(profileInfo.data.avatar);
      }
    }
  }, [profileInfo]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image size should be less than 2MB",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a .jpg, .jpeg, or .png file",
          variant: "destructive",
        });
        return;
      }
      
      // Create a local preview URL
      const previewUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      
      // Update the avatar preview
      setAvatarUrl(previewUrl);
    }
  };

  const handleAvatarUpload = async () => {
    try {
      if (!selectedFile && !avatarUrl) {
        toast({
          title: "No image selected",
          description: "Please select an image to upload",
          variant: "destructive",
        });
        return;
      }

      // In a real application, you would upload the file to your server/cloud storage
      // and get back a URL. Here we're using the current avatar URL for demonstration.
      
      // This is where you would normally upload the file and get a URL back
      // For now, we'll just use the current avatar URL from the profile
      const currentAvatarUrl = profileInfo?.data?.avatar || 
        "https://villagesonmacarthur.com/wp-content/uploads/2020/12/Blank-Avatar.png";
      
      // Call the API to update the profile avatar
      const result = await updateAvatar(currentAvatarUrl).unwrap();
      
      if (result.isSucceed) {
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been updated successfully",
        });
      } else {
        throw new Error(result.messages || "Failed to update avatar");
      }
      
      // Reset the file selection but keep the avatar URL
      setSelectedFile(null);
    } catch (error) {
      console.error("Avatar Update Error:", error);
      toast({
        title: "Avatar Update Failed",
        description: error?.data?.messages || error.message || "Failed to update profile picture",
        variant: "destructive",
      });
    }
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
      };
  
      const response = await updateProfile(payload).unwrap();
  
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 rounded-lg shadow-sm space-y-6">
        <h2 className="text-2xl font-bold">Profile Settings</h2>

        {/* Profile Picture */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center border">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://villagesonmacarthur.com/wp-content/uploads/2020/12/Blank-Avatar.png";
                  }}
                />
              ) : (
                <UserCircle className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <div>
                  <input 
                    type="file" 
                    id="profile-picture" 
                    className="hidden" 
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageChange} 
                  />
                  <label
                    htmlFor="profile-picture"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 inline-block"
                  >
                    Choose File
                  </label>
                </div>
                
                <Button 
                  type="button" 
                  onClick={handleAvatarUpload}
                  disabled={isAvatarUploading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isAvatarUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Avatar"
                  )}
                </Button>
              </div>
              
              <p className="text-sm text-gray-500">
                {selectedFile ? `Selected: ${selectedFile.name}` : "No new file selected"}
              </p>
              <p className="text-sm text-gray-500">
                *Image size should be less than 2MB. Allowed files: .png, .jpg, .jpeg.
              </p>
            </div>
          </div>
        </div>

        {/* General Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h3 className="text-lg font-semibold mb-4 md:col-span-2">General Information</h3>
          
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                  </Select>
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
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
