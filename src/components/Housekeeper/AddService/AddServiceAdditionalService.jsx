import { CirclePlus, Trash2 } from "lucide-react";
import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
function AddServiceAdditionalService({
  form,
  additionalRemove,
  additionalAppend,
  additionalFields,
}) {
  return (
    <AccordionItem value="item-6">
      <AccordionTrigger className="text-lg text-primary">
        Additional Service
      </AccordionTrigger>
      <AccordionContent>
        {additionalFields?.map((field, idx) => (
          <div
            key={field.id}
            className="flex flex-wrap w-full gap-6 items-center my-4"
          >
            <FormField
              control={form.control}
              name={`additionalServices.${idx}.additionalImage`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`additionalServices.${idx}.additional_service_name`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Additional service name" />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`additionalServices.${idx}.amount`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Additional service price" />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`additionalServices.${idx}.duration`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Additional service duration"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="icon"
              className="mt-4"
              type="button"
              onClick={() => additionalRemove(idx)}
            >
              <Trash2 color="red" />
            </Button>
          </div>
        ))}
        <Button
          onClick={() =>
            additionalAppend({
              additionalImage: "",
              additional_service_name: "",
              amount: "",
              duration: "",
            })
          }
          variant="outline"
          type="button"
        >
          <CirclePlus />
          <span>Add New</span>
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}

export default AddServiceAdditionalService;
