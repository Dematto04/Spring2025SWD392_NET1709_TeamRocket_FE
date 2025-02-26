import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CirclePlus, Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { serviceTimeSlots } from "./slotData";
import DragAndDropUpload from "@/components/DragAndDropUpload";
import { useCreateServiceMutation, useGetCategoriesQuery } from "@/redux/api/serviceApi";
const formSchema = z.object({
  service_name: z.string().min(1, { message: "Service name is required" }),
  category_id: z.string().min(1, { message: "Service name is required" }),
  description: z
    .string()
    .min(1, { message: "Service description is required" })
    .max(225, { message: "Max characters is 225" }),
  duration: z.string().min(1, { message: "Service duration is required" }),
  price: z.string().min(1, { message: "Service price is required" }),
  serviceSteps: z.array(
    z.object({
      step_order: z.number(),
      step_description: z.string().min(1, "Description is required"),
    })
  ),
  additionalServices: z.array(
    z.object({
      additional_service_name: z
        .string()
        .min(1, { message: "Additional service name is required" }),
      amount: z
        .string()
        .min(1, { message: "Additional service price is required" }),
    })
  ),
  city: z.string().min(1, {message: "City is required"}),
  province: z.string().min(1, {message: "Province is required"}),
  address_line: z.string().min(1, {message: "Address is required"}),
});
// thiếu field image
function HousekeeperAddService() {
  const [dateOfWeek, setDateOfWeek] = useState(serviceTimeSlots);
  const [files, setFiles] = useState([]);
  //api cateogry
  const { data: categories, isLoading } = useGetCategoriesQuery();
  //api create service
  const [createService, {isSuccess, isLoading: isCreating}] = useCreateServiceMutation()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service_name: "",
      category_id: "",
      description: "",
      duration: 0,
      price: 0,
      serviceSteps: [{ step_order: 1, step_description: "" }],
      additionalServices: [],
      city: "",
      province: "",
      address_line: ""

    },
  });
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "serviceSteps",
  });
  const {
    fields: addtionalFields,
    append: additionalAppend,
    remove: additionalRemove,
  } = useFieldArray({
    control,
    name: "additionalServices",
  });
  const handleSubmit = (data) => {
    

    const haveSlotDays = dateOfWeek.filter((date) => date.slots.length > 0);
    const serviceTimeSlots = [];
    haveSlotDays.forEach((date) => {
      date.slots.forEach((slot) => {
        serviceTimeSlots.push({
          start_time: slot.start_time,
          day_of_week: date.dateOfWeek,
          date_start: new Date(),
        });
      });
    });
    const body = {
      ...data,
      serviceTimeSlots
    }
    console.log({body});
    
  };
  if (isLoading) return null;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Add Service</CardTitle>
            </CardHeader>

            <CardContent className="rounded-lg">
              <Accordion
                type="multiple"
                collapsible="true"
                defaultValue={[
                  "item-1",
                  "item-2",
                  "item-3",
                  "item-4",
                  "item-5",
                  "item-6",
                ]}
              >
                {/* Basic Info */}
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg">
                    Basis Information
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex w-full gap-6">
                      <FormField
                        control={form.control}
                        name="service_name"
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormLabel>Service Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Your service name"
                              />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.data &&
                                    categories.data.map((category) => (
                                      <SelectItem key={category.id} value={category.id}>
                                        {category.name}
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
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Detail and service steps*/}
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg">
                    Detail
                  </AccordionTrigger>
                  {/* Service Step  */}
                  <AccordionContent className="">
                    <FormLabel>Service Steps</FormLabel>
                    {fields.map((field, index) => {
                      return (
                        <div
                          key={field.id}
                          className="border p-4 rounded-lg mt-5"
                        >
                          <div className="flex items-center gap-3 ">
                            {/* Step Order */}
                            <FormField
                              control={control}
                              name={`serviceSteps.${index}.step_order`}
                              render={() => (
                                <FormItem className="w-1/12">
                                  <FormLabel>Step Order</FormLabel>
                                  <FormControl>
                                    <Input
                                      readOnly
                                      type="number"
                                      value={index + 1}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Step Description */}
                            <FormField
                              control={control}
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
                          step_order:
                            fields.length === 0 ? 1 : fields.length + 1,
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
                {/* Pricing  */}
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg">
                    Pricing
                  </AccordionTrigger>
                  <AccordionContent className="flex gap-3">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem className="w-1/5">
                          <FormLabel>Estimate Duration (min)</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="w-1/5">
                          <FormLabel>Price</FormLabel>
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
                {/* Availability  */}
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg">
                    Availability
                  </AccordionTrigger>
                  <AccordionContent>
                    {dateOfWeek.map((day, dayIndex) => (
                      <div key={dayIndex} className="mb-4">
                        <div className="flex items-center gap-2">
                          <FormLabel>{day.dateOfWeek}</FormLabel>
                          <Plus
                            size={18}
                            className="hover:text-primary cursor-pointer duration-100"
                            onClick={() => {
                              setDateOfWeek((prev) =>
                                prev.map((item, i) =>
                                  i === dayIndex
                                    ? {
                                        ...item,
                                        slots: [
                                          ...item.slots,
                                          { start_time: "" },
                                        ],
                                      }
                                    : item
                                )
                              );
                            }}
                          />
                        </div>

                        {day.slots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="flex items-center gap-2 mt-2"
                          >
                            <FormControl className="w-1/5">
                              <Input
                                type="time"
                                value={slot.start_time}
                                onChange={(e) => {
                                  const updatedSlots = [...dateOfWeek];
                                  updatedSlots[dayIndex].slots[
                                    slotIndex
                                  ].start_time = e.target.value;
                                  setDateOfWeek([...updatedSlots]);
                                }}
                              />
                            </FormControl>
                            <Button
                              variant="icon"
                              className="p-1"
                              type="button"
                              onClick={() => {
                                setDateOfWeek((prev) =>
                                  prev.map((item, i) =>
                                    i === dayIndex
                                      ? {
                                          ...item,
                                          slots: item.slots.filter(
                                            (_, idx) => idx !== slotIndex
                                          ),
                                        }
                                      : item
                                  )
                                );
                              }}
                            >
                              <Trash2 color="red" size={18} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                {/* Location  */}
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg">
                    Location
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex w-full gap-6 p-2">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem className="w-1/5">
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter city" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem className="w-1/5">
                            <FormLabel>Province</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter province" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address_line"
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter specify address"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* Gallery  */}
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg">
                    Gallery
                  </AccordionTrigger>
                  <AccordionContent>
                    <DragAndDropUpload files={files} setFiles={setFiles} />
                  </AccordionContent>
                </AccordionItem>

                {/* additional Service */}
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg">
                    Additional Service
                  </AccordionTrigger>
                  <AccordionContent>
                    {addtionalFields?.map((field, idx) => (
                      <div
                        key={field.id}
                        className="flex w-full gap-6 items-center my-4"
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
                                <Input
                                  {...field}
                                  placeholder="Additional service name"
                                />
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
                                <Input
                                  {...field}
                                  placeholder="Additional service price"
                                />
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
              </Accordion>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Submit</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

export default HousekeeperAddService;
