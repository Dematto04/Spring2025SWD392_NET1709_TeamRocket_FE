import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
} from "@/redux/api/addressApi";
import AutoComplete from "../AutoComplete";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

// Define the form schema using Zod
const addressSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  address_line: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  district: z.string().min(1, { message: "District is required" }),
  place_id: z.string().optional(),
  isDefault: z.boolean(),
});

const AddressList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);

  const addressesPerPage = 3;

  const { data, isLoading, isError } = useGetAddressesQuery({
    pageIndex: currentPage,
    pageSize: addressesPerPage,
  });

  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      title: "",
      location: "",
      address_line: "",
      city: "",
      district: "",
      place_id: "",
      isDefault: false,
    },
  });

  // Listen for changes to the form values from AutoComplete
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      // Check if address, city, and district have values
      if (value.address_line && value.city && value.district) {
        setAddressSelected(true);
      } else {
        setAddressSelected(false);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const totalPages = Math.ceil((data?.data?.totalCount || 0) / addressesPerPage);
  const currentAddresses = data?.data?.items || [];

  const openForm = (address = null) => {
    setSelectedAddress(address);
    if (address) {
      form.reset({
        title: address.title,
        location: address.place_id,
        address_line: address.address_line,
        city: address.city,
        district: address.district,
        place_id: address.place_id,
        isDefault: address.isDefault,
      });
    } else {
      form.reset({
        title: "",
        location: "",
        address_line: "",
        city: "",
        district: "",
        place_id: "",
        isDefault: false,
      });
    }
    setIsFormOpen(true);
  };

  const saveAddress = async (data) => {
    try {
      const payload = {
        title: data.title,
        address_line: data.address_line,
        city: data.city,
        district: data.district,
        place_id: data.place_id,
        isDefault: data.isDefault,
      };

      console.log("Submitting address data:", payload);

      if (selectedAddress) {
        await updateAddress({
          id: selectedAddress.id,
          ...payload,
        }).unwrap();
        toast({
          title: "Success",
          description: "Address updated successfully!",
        });
      } else {
        await addAddress(payload).unwrap();
        toast({
          title: "Success",
          description: "Address added successfully!",
        });
      }
      setIsFormOpen(false);
      setSelectedAddress(null);
      setAddressSelected(false);
      form.reset();
    } catch (err) {
      console.error("Failed to save address:", err);
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading addresses</div>;

  return (
    <div className="p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Saved Addresses</h2>
      
      {/* Add New Address Button (when form is closed) */}
      {!isFormOpen && (
        <Button 
          onClick={() => openForm()} 
          className="mb-6"
        >
          Add New Address
        </Button>
      )}
      
      {/* Address Form Collapsible */}
      <Collapsible
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        className="mb-6 border rounded-lg p-4"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex justify-between items-center"
          >
            <span>{selectedAddress ? "Edit Address" : "Add New Address"}</span>
            <span className="text-xs">{isFormOpen ? "▼" : "▶"}</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(saveAddress)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Home, Office, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Address Selection */}
              <div className="space-y-2">
                <FormLabel>Location</FormLabel>
                <AutoComplete 
                  form={form}
                  defaultAddress={form.getValues("address_line")}
                  defaultAddressId={form.getValues("place_id")}
                />
              </div>
              
              {/* Display selected address details for verification */}
              {addressSelected && (
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p className="font-medium mb-1">Selected Location:</p>
                  <p>{form.watch("address_line")}</p>
                  <p>{form.watch("city")}, {form.watch("district")}</p>
                </div>
              )}
              
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Set as default address</FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    setSelectedAddress(null);
                    setAddressSelected(false);
                    form.reset();
                  }}
                  type="button"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isAdding || isUpdating || !addressSelected}
                >
                  {selectedAddress ? "Save Changes" : "Add Address"}
                </Button>
              </div>
            </form>
          </Form>
        </CollapsibleContent>
      </Collapsible>

      {/* Address List */}
      {currentAddresses.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted">
          <p className="text-lg text-muted-foreground">No addresses saved yet</p>
          <p className="text-sm text-muted-foreground mt-2">Add an address to get started</p>
        </div>
      ) : (
        currentAddresses.map((address) => (
          <Card
            key={address.id}
            className="mb-4 border border-gray-300 rounded-lg"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{address.title}</h3>
                    {address.isDefault && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                    )}
                  </div>
                  <p className="mt-2">{address.address_line}</p>
                  <p className="text-sm text-muted-foreground">{address.city}, {address.district}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => openForm(address)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentPage((prev) => Math.max(prev - 1, 1));
            }}
            disabled={currentPage === 1}
          >
            {"< Prev"}
          </Button>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "default" : "outline"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentPage(index + 1);
              }}
              disabled={isAdding || isUpdating}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
            }}
            disabled={currentPage === totalPages}
          >
            {"Next >"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddressList;