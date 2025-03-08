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
import { Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
function AddServiceDetail({form, fields, remove, append}) {
  return (
    <AccordionItem value="item-2">
      <AccordionTrigger className="text-lg text-primary">Detail</AccordionTrigger>
      {/* Service Step  */}
      <AccordionContent className="">
        <FormLabel>Service Steps</FormLabel>
        {fields.map((field, index) => {
          return (
            <div key={field.id} className="border p-4 rounded-lg mt-5">
              <div className="flex flex-wrap items-center gap-3 ">
                {/* Step Order */}
                <FormField
                  control={form.control}
                  name={`serviceSteps.${index}.step_order`}
                  render={() => (
                    <FormItem className="w-1/3 md:w-1/12">
                      <FormLabel>Step Order</FormLabel>
                      <FormControl>
                        <Input readOnly type="number" value={index + 1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Step Description */}
                <FormField
                  control={form.control}
                  name={`serviceSteps.${index}.step_description`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Step Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="What you will do in this step"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Xóa step */}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                  className="mt-6"
                >
                  <Trash2 size={18} color="red" />
                </Button>
              </div>
            </div>
          );
        })}
        <div></div>
        {/* add step */}
        <Button
          type="button"
          variant="outline"
          className="my-3"
          onClick={() =>
            append({
              step_order: fields.length === 0 ? 1 : fields.length + 1,
              step_description: "",
            })
          }
        >
          <Plus size={16} /> Add Step
        </Button>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Your service overview"
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

export default AddServiceDetail;
