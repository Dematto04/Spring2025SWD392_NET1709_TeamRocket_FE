import { useAddAddressMutation } from "@/redux/api/addressApi";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"; // Fixed import
import AutoComplete from "../AutoComplete";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function ServiceBookingAddAddress() {
  const form = useForm({
    defaultValues: {
      address_line: "",
      city: "",
      district: "",
      place_id: "",
      title: "",
    },
  });
  const [addAddress, { isLoading }] = useAddAddressMutation();

  const onSubmit = async (data) => {
    console.log({ data });
    try {
      await addAddress(data).unwrap();
    } catch (error) {
      console.error("Failed to add address:", error);
    }
  };

  return (
    <Dialog className="w-fit">
      <DialogTrigger asChild>
        <Button>Add Address</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-fit">
        <DialogHeader>
          <h2 className="text-lg font-semibold">Add New Address</h2>
        </DialogHeader>
        <Form {...form} className="w-fit">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-fit"
          >
            <FormField
              name="title"
              control={form.control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Address title"
                      className="input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AutoComplete form={form} />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ServiceBookingAddAddress;
