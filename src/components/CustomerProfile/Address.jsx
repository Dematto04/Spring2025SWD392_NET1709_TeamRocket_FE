import React, { useState } from "react";
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

// Define the form schema using Zod
const addressSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  district: z.string().min(1, { message: "District is required" }),
  placeId: z.string().optional(),
  isDefault: z.boolean(),
});

const AddressList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
      address: "",
      city: "",
      district: "",
      placeId: "",
      isDefault: false,
    },
  });

  const totalPages = Math.ceil((data?.data?.totalCount || 0) / addressesPerPage);
  const currentAddresses = data?.data?.items || [];

  const openForm = (address = null) => {
    setSelectedAddress(address);
    if (address) {
      form.reset({
        title: address.title,
        address: address.address,
        city: address.city,
        district: address.district,
        placeId: address.placeId || "",
        isDefault: address.isDefault,
      });
    } else {
      form.reset({
        title: "",
        address: "",
        city: "",
        district: "",
        placeId: "",
        isDefault: false,
      });
    }
    setIsFormOpen(true);
  };

  const saveAddress = async (data) => {
    try {
      const payload = {
        title: data.title,
        address: data.address,
        city: data.city,
        district: data.district,
        placeId: data.placeId,
        isDefault: data.isDefault,
      };

      if (selectedAddress) {
        await updateAddress({
          id: selectedAddress.id,
          ...payload,
        }).unwrap();
        console.log("Address updated successfully!");
      } else {
        await addAddress(payload).unwrap();
        console.log("Address added successfully!");
      }
      setIsFormOpen(false);
      setSelectedAddress(null);
      form.reset();
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Failed to save address. Please try again.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading addresses</div>;

  return (
    <div className="p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Saved Addresses</h2>
      
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
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-wrap w-full gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={() => (
                    <FormItem className="flex-grow">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <AutoComplete form={form} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormLabel className="m-0">Set as Default</FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    setSelectedAddress(null);
                    form.reset();
                  }}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isAdding || isUpdating}>
                  {selectedAddress ? "Save Changes" : "Add Address"}
                </Button>
              </div>
            </form>
          </Form>
        </CollapsibleContent>
      </Collapsible>

      {/* Address List */}
      {currentAddresses.map((address) => (
        <Card
          key={address.id}
          className="mb-4 border border-gray-300 rounded-lg"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{address.title}</h3>
                <p>Address: {`${address.address}, ${address.city}, ${address.district}`}</p>
                <p>Default: {address.isDefault ? "Yes" : "No"}</p>
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
      ))}

      {/* Pagination - keep existing pagination code */}
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
    </div>
  );
};

export default AddressList;