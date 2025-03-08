import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFieldArray } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

function AddServiceAvailability({ form, dateOfWeek }) {
  console.log(form.watch("serviceTimeSlots"));
  const handleAppend = (append) => {
    const isFilledDuration = form.getValues("duration");
    if (!isFilledDuration) {
      toast({
        title: "Please fill duration first!",
        description: "Fill first so we can estimate end time 😊",
        variant: "warning",
      });
      form.trigger("duration");
      return;
    }
    append("");
  };
  return (
    <AccordionItem value="item-4">
      <AccordionTrigger className="text-lg text-primary">Availability</AccordionTrigger>
      <AccordionContent>
        <div className="text-primary mb-4">
          In order to ensure service quality, each time slot should be 30
          minutes apart.{" "}
        </div>
        {dateOfWeek.map((day, dayIndex) => {
          const { fields, append, remove } = useFieldArray({
            name: `serviceTimeSlots.${dayIndex}.slots`,
            control: form.control,
          });

          return (
            <div key={day.dateOfWeek} className="mb-4">
              <div className="flex items-center gap-2">
                <FormLabel>{day.dateOfWeek}</FormLabel>
                <Plus
                  size={18}
                  className="hover:text-primary cursor-pointer duration-100"
                  onClick={() => handleAppend(append)}
                />
              </div>

              {fields.map((slot, index) => (
                <FormField
                  key={slot.id}
                  control={form.control}
                  name={`serviceTimeSlots.${dayIndex}.slots.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-end">
                        <FormControl className="w-full md:1/2 lg:w-1/5">
                          <Input {...field} type="time" />
                        </FormControl>
                        <Button
                          variant="icon"
                          className="p-1"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <Trash2 color="red" size={18} />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
}

export default AddServiceAvailability;
