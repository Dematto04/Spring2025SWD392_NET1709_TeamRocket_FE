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

  const handleTimeChange = (value, index, dayIndex) => {
    let duration = parseFloat(form.getValues("duration"));
    if (isNaN(duration) || duration <= 0) {
      toast({
        title: "Invalid Duration",
        description: "Please enter a valid duration (in hours).",
        variant: "destructive",
      });
      return;
    }
    // Chuyển duration sang phút và cộng thêm 30 phút
    const minGap = duration * 60 + 30;
    const timeSlots =
      form.getValues(`serviceTimeSlots.${dayIndex}.slots`) || [];

    // Chuyển đổi giờ sang phút
    const convertToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    // Cập nhật giá trị mới vào form
    form.setValue(`serviceTimeSlots.${dayIndex}.slots.${index}`, value);

    // Lấy danh sách thời gian đã nhập và sắp xếp tăng dần
    const sortedTimes = [...timeSlots];
    sortedTimes[index] = value;
    sortedTimes.sort((a, b) => convertToMinutes(a) - convertToMinutes(b));

    // Kiểm tra khoảng cách giữa các slot
    for (let i = 1; i < sortedTimes.length; i++) {
      const prevTime = convertToMinutes(sortedTimes[i - 1]);
      const currTime = convertToMinutes(sortedTimes[i]);
      if (currTime - prevTime < minGap) {
        toast({
          title: "Invalid Time Slot",
          description: `Each slot must be at least ${duration} hours + 30 minutes apart.`,
          variant: "destructive",
        });
        form.setValue(`serviceTimeSlots.${dayIndex}.slots.${index}`, "");
        return;
      }
    }
  };

  return (
    <AccordionItem value="item-4">
      <AccordionTrigger className="text-lg text-primary">
        Availability
      </AccordionTrigger>
      <AccordionContent>
        <div className="text-primary mb-4">
          In order to ensure service quality, each time slot should be at least{" "}
          <strong>duration (hours) + 30 minutes</strong> apart.
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
                          <Input
                            {...field}
                            type="time"
                            onChange={(e) =>
                              handleTimeChange(e.target.value, index, dayIndex)
                            }
                          />
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
