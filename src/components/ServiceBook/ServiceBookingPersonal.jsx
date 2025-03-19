import React, { useEffect, useContext, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { containerVariants } from "@/lib/utils";

import { ServiceBookContext } from "./ServiceBookContext";
import AutoComplete from "../AutoComplete";
import { useCustomerProfileQuery } from "@/redux/api/customerProfileApi";
import LoadingScreen from "../Loading";
import { useGetAddressesQuery } from "@/redux/api/addressApi";
import AddressList from "./AddressList";
import ServiceBookingAddAddress from "./ServiceBookingAddAddress";

function ServiceBookingPersonal() {
  const { data, isLoading, isSuccess } = useCustomerProfileQuery();
  const {
    data: address,
    isLoading: isGetting,
    isError,
    isSuccess: isOk,
  } = useGetAddressesQuery({
    pageIndex: 1,
    pageSize: 100,
  });
  const [defaultAddress, setDefaultAddress] = useState();
  

  const { form } = useContext(ServiceBookContext);

  useEffect(() => {
    if (isSuccess && data?.data) {
      form.setValue("fullName", data.data.full_name || "");
      form.setValue("email", data.data.email || "");
      form.setValue("phoneNumber", data.data.phone || "");
    }
    if (isOk && address?.data) {
      const defaultValue = address.data.items.find(
        (address) => address.isDefault
      );

      if (defaultValue) {
        setDefaultAddress({
          defaultAddress: defaultValue?.address_line,
          defaultAddressId: defaultValue?.place_id,
        });
        form.setValue("location", defaultValue.place_id);
        form.setValue("city", defaultValue.city || "");
        form.setValue("district", defaultValue?.district || "");
        form.setValue("address_line", defaultValue.address || "");
        form.setValue("place_id", defaultValue.place_id);
        form.setValue("addressId", defaultValue.id);
      }
    }
  }, [isSuccess, data, isOk, form]);

  if (isLoading || isGetting) return <LoadingScreen />;

  return (
    isSuccess &&
    isOk && (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((formData) => console.log(formData))}
            className="rounded-lg shadow-sm space-y-6"
          >
            <h1 className="font-semibold leading-none tracking-tight mb-4">
              Add Personal Information
            </h1>

            {/* General Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email *</Label>
                    <FormControl>
                      <Input readOnly {...field} id="email" />
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
            </div>

            {/* Address Section */}
            <div className="mt-6">
              <Label>Address *</Label>
              <div className="flex justify-start gap-4 items-start mt-3 rounded-md">
                <AutoComplete
                  form={form}
                  defaultAddress={defaultAddress?.defaultAddress}
                  defaultAddressId={defaultAddress?.defaultAddressId}
                />
                <AddressList
                  addressList={address.data.items}
                  setDefaultAddress={setDefaultAddress}
                />
                <ServiceBookingAddAddress/>
              </div>
            </div>
          </form>
        </Form>
      </motion.div>
    )
  );
}

export default ServiceBookingPersonal;
