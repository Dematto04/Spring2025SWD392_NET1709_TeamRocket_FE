import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Accordion, AccordionContent,AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addressesPerPage = 5;

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

  const addresses = data?.data?.map((addr) => ({
    id: addr.id,
    title: addr.title,
    address: addr.address,
    city: addr.city,
    district: addr.district,
    placeId: addr.placeId,
    isDefault: addr.isDefault,
    details: `${addr.address}, ${addr.city}, ${addr.district}`,
  })) || [];

  const totalPages = Math.ceil((data?.data?.length || 0) / addressesPerPage);
  const currentAddresses = addresses.slice(
    (currentPage - 1) * addressesPerPage,
    currentPage * addressesPerPage
  );

  const openDialog = (address = null) => {
    console.log("Opening dialog for address:", address); // Debug: Log when opening
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
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    console.log("Closing dialog"); // Debug: Log when closing
    setIsDialogOpen(false);
    setSelectedAddress(null);
    form.reset();
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
      closeDialog();
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Failed to save address. Please try again.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading addresses</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Saved Addresses</h2>
      <div className="mb-6">
        <Button
          onClick={(e) => {
            e.preventDefault(); // Prevent default behavior
            e.stopPropagation(); // Prevent event bubbling
            openDialog();
          }}
          disabled={isAdding || isUpdating}
        >
          Add Address
        </Button>
      </div>
      {currentAddresses.map((address) => (
        <Card
          key={address.id}
          className="mb-4 border border-gray-300 rounded-lg cursor-pointer"
          onClick={(e) => {
            e.preventDefault(); // Prevent default behavior
            e.stopPropagation(); // Prevent event bubbling
            openDialog(address);
          }}
          disabled={isAdding || isUpdating}
        >
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg">{address.title}</h3>
            <p className="text-gray-600">Address: {address.details}</p>
            <p className="text-gray-600">
              Default: {address.isDefault ? "Yes" : "No"}
            </p>
          </CardContent>
        </Card>
      ))}

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

      {/* Debug: Log Dialog state */}
      {console.log("isDialogOpen:", isDialogOpen)}
          {/* Pop up start */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          style={{ zIndex: 1000, position: "relative" }}
        >
          <DialogHeader>
            <DialogTitle>
              {selectedAddress ? "Edit Address" : "Add Address"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(saveAddress, (err) => {
                console.log("Validation errors:", err);
              })}
              className="space-y-4"
            >
              <Accordion
                type="single"
                collapsible
                defaultValue="address-details"
                className="w-full"
              >
                <AccordionItem value="address-details">
                  <AccordionTrigger className="text-lg">
                    {selectedAddress
                      ? `Edit ${selectedAddress.title}`
                      : "Add New Address"}
                  </AccordionTrigger>
                  <AccordionContent>
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
                    <div className="flex flex-wrap w-full gap-6 p-2">
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog} type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={isAdding || isUpdating}>
                  {selectedAddress ? "Save Changes" : "Add Address"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressList;