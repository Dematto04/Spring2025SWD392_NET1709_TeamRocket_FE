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
import { Input } from "@/components/ui/input";

function AddServicePrice({ form }) {
  return (
    <AccordionItem value="item-3">
      <AccordionTrigger className="text-lg text-primary">
        Pricing
      </AccordionTrigger>
      <AccordionContent className="block lg:flex lg:gap-3">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="w-1/4 lg:w-1/5">
              <FormLabel>Price ($USD)</FormLabel>
              <FormControl>
                <Input
                  min={0}
                  type="number"
                  {...field}
                  className="focus-visible:ring-0"
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
      </AccordionContent>
    </AccordionItem>
  );
}

export default AddServicePrice;
