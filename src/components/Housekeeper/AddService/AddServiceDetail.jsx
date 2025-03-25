import React, { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const minuteHandle = (min) => {
  if (min < 60) {
    return min + " min";
  }
  const hour = Math.floor(min / 60);
  const remainMin = min % 60 ? `${min % 60}min` : "";
  return `${hour}h ${remainMin}`;
};
function AddServiceDetail({ form, fields, remove, append }) {
  // Calculate total duration whenever serviceSteps change
  const totalDuration = form.watch("serviceSteps", [])
    .reduce((acc, item) => acc + (item.step_duration || 0), 0);
  
  // Update duration field and reset timeslots when steps change
  useEffect(() => {
    const currentDuration = form.getValues("duration");
    
    // Only update when duration changes to avoid unnecessary rerenders
    if (totalDuration.toString() !== currentDuration) {
      form.setValue("duration", totalDuration.toString());
      
      // Reset all time slots when duration changes
      const timeSlots = form.getValues("serviceTimeSlots");
      if (timeSlots && timeSlots.length > 0) {
        timeSlots.forEach((_, index) => {
          form.setValue(`serviceTimeSlots.${index}.slots`, []);
        });
      }
    }
  }, [totalDuration, form]);

  return (
    <AccordionItem value="item-2">
      <AccordionTrigger className="text-lg text-primary">
        Detail
      </AccordionTrigger>
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
                <FormField
                  control={form.control}
                  name={`serviceSteps.${index}.step_duration`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                          }}
                          defaultValue={field.value?.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            {[15, 30, 45, 60, 75, 90, 105, 120].map((value) => (
                              <SelectItem key={value} value={value.toString()}>
                                {minuteHandle(value)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription />
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
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            className="my-3"
            onClick={() =>
              append({
                step_order: fields.length === 0 ? 1 : fields.length + 1,
                step_description: "",
                step_duration: 0,
              })
            }
          >
            <Plus size={16} /> Add Step
          </Button>
          {/* Duration Display Card */}
          <div className="w-full  rounded-2xl text-end">
            <div className="p-4 font-medium">
              Total Duration: {minuteHandle(totalDuration)}
            </div>
          </div>
        </div>

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
