import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { containerVariants } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { ServiceBookContext } from "./ServiceBookContext";
import AutoComplete from "../AutoComplete";

function ServiceBookingPersonal() {
  const [defaultAddress, setDefaultAddress] = useState("123 Main St, City A");
  const [newAddress, setNewAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([
    "123 Main St, City A",
    "456 Oak Ave, City B",
  ]);
  const { form } = useContext(ServiceBookContext);

  const handleSelectAddress = (address) => {
    setDefaultAddress(address);
  };

  const handleAddNewAddress = () => {
    if (newAddress.trim() !== "") {
      setSavedAddresses([...savedAddresses, newAddress]);
      setDefaultAddress(newAddress);
      setNewAddress("");
    }
  };
  const handleInfo = (data) => {
    console.log({data});
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleInfo, (err) => {
            console.log(err);
          })}
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

          {/* Address Section */}
          <div className="mt-6">
            <Label>Address *</Label>
            <div className="flex justify-between items-center  mt-3 rounded-md">
              <AutoComplete form={form}/>
              {/* <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Change</Button>
                </DialogTrigger>
                <DialogContent>
                  <h2 className="text-lg font-semibold mb-4">
                    Choose an Address
                  </h2>
                  <div className="space-y-3">
                    {savedAddresses.map((address, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md border cursor-pointer ${
                          defaultAddress === address
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100"
                        }`}
                        onClick={() => handleSelectAddress(address)}
                      >
                        {address}
                      </div>
                    ))}
                    <Accordion type="single" collapsible>
                      <AccordionItem value={"123"}>
                        <AccordionTrigger>
                          <Label className="mb-4">New Address</Label>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Input
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            placeholder="Enter new address"
                            className="py-5 focus:outline-none focus-visible:ring-0"
                          />
                          <Button
                            className="mt-8 w-full"
                            onClick={handleAddNewAddress}
                          >
                            Add Address
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </DialogContent>
              </Dialog> */}
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}

export default ServiceBookingPersonal;
