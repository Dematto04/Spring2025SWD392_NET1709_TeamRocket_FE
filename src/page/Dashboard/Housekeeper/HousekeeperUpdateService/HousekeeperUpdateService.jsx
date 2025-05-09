import React, { useEffect, useState } from "react";
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
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { serviceTimeSlots } from "./slotData";
import DragAndDropUpload from "@/components/DragAndDropUpload";
import {
  useGetCategoriesQuery,
  useGetMyServicesDetailQuery,
  useUpdateServiceMutation,
} from "@/redux/api/serviceApi";
import { toast } from "@/hooks/use-toast";
import HousekeeperDistanceRule from "@/components/Housekeeper/HousekeeperDistanceRule";
import BasisInformation from "@/components/Housekeeper/UpdateService/BasisInformation";
import LoadingScreen from "@/components/Loading";
import UpdateServiceDetail from "@/components/Housekeeper/UpdateService/UpdateServiceDetail";
import UpdateServicePrice from "@/components/Housekeeper/UpdateService/UpdateServicePrice";
import UpdateServiceAvailability from "@/components/Housekeeper/UpdateService/UpdateServiceAvailability";
import UpdateServiceAdditionalService from "@/components/Housekeeper/UpdateService/UpdateServiceAdditionalService";
import { useLocation, useParams } from "react-router-dom";

const formSchema = z.object({
  service_name: z.string().min(1, { message: "Service name is required" }),
  category_id: z.string().min(1, { message: "Service name is required" }),
  description: z
    .string()
    .min(1, { message: "Service description is required" })
    .max(2000, { message: "Max characters is 2000" }),
  price: z.string().min(1, { message: "Service price is required" }),
  serviceSteps: z.array(
    z.object({
      step_order: z.number(),
      step_description: z.string().min(1, "Description is required"),
      step_duration: z
        .number()
        .gt(0, { message: "Duration must be greater than 0" }),
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
      duration: z
        .number()
        .min(1, { message: "Additional service duration is required" }),
      url: z
        .string()
        .min(1, { message: "Additional service image is required" }),
      description: z
        .string()
        .min(1, { message: "Additional service description is required" }),
    })
  ),
  serviceDistanceRule: z.array(
    z
      .object({
        min_distance: z
          .string({ message: "Please input" })
          .min(1, { message: "Please input min distance" }),
        max_distance: z
          .string({ message: "Please input" })
          .min(1, { message: "Please input max distance" }),
        base_fee: z
          .string({ message: "Please input" })
          .min(1, { message: "Please input base fee" }),
      })
      .refine(
        (data) => parseFloat(data.max_distance) > parseFloat(data.min_distance),
        {
          message: "Max distance must be greater than min distance",
          path: ["max_distance"],
        }
      )
  ),
  serviceTimeSlots: z.array(
    z.object({
      slots: z.array(z.string().min(1, { message: "Time slot is required" })),
    })
  ),
});

function HousekeeperUpdateService() {
  const [dateOfWeek, setDateOfWeek] = useState(serviceTimeSlots);
  const [files, setFiles] = useState([]);
  //api cateogry
  const location = useLocation();

  const { id } = useParams();
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [updateService, { isSuccess, isLoading: isUpdating }] =
    useUpdateServiceMutation();

  const {
    data: myService,
    isLoading: isGettingMyService,
    isSuccess: isOk,
    refetch: refetchServiceDetail,
  } = useGetMyServicesDetailQuery(id);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service_name: "",
      category_id: "",
      description: "",
      duration: "",
      price: "",
      serviceSteps: [{ step_order: 1, step_description: "", step_duration: 0 }],
      additionalServices: [],
      serviceDistanceRule: [],
      serviceTimeSlots: [],
    },
  });
  useEffect(() => {
    refetchServiceDetail();
  }, [location.pathname, refetchServiceDetail]);
  useEffect(() => {
    console.log("HousekeeperUpdateService mounted");
    return () => {
      console.log("HousekeeperUpdateService unmounted");
    };
  }, []);

  useEffect(() => {
    if (myService && isOk) {
      const service = myService.data;
      form.setValue("service_name", service?.service_name);
      form.setValue("category_id", service?.category_id);
      form.setValue("description", service?.description);
      form.setValue("duration", service?.duration * 60);
      form.setValue("price", String(service?.price));
      form.setValue(
        "serviceSteps",
        service?.serviceSteps?.map((step) => ({
          ...step,
          step_duration: Number(step.step_duration),
        })) || []
      );
      form.setValue("serviceDistanceRule", service?.serviceDistanceRule);
      setFiles(service?.serviceImages?.map((image) => image.link) || []);
      form.setValue(
        "additionalServices",
        (service?.additionalServices || []).map((item) => ({
          ...item,
          duration: Number(item.duration),
        }))
      );
    }
  }, [myService, isOk, isGettingMyService]);
  useEffect(() => {
    if (myService && isOk) {
      const service = myService.data;

      dateOfWeek.forEach((day, index) => {
        const timeSlots = service?.serviceTimeSlots.filter(
          (slot) => slot.day_of_week === day.dateOfWeek
        );
        form.setValue(
          `serviceTimeSlots.${index}.slots`,
          timeSlots.map((slot) => slot.start_time)
        );
      });
    }
  }, [form.getValues("duration")]);

  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "serviceSteps",
  });
  const {
    fields: additionalFields,
    append: additionalAppend,
    remove: additionalRemove,
  } = useFieldArray({
    control,
    name: "additionalServices",
  });
  const {
    fields: ruleFields,
    append: ruleAppend,
    remove: ruleRemove,
  } = useFieldArray({
    control,
    name: "serviceDistanceRule",
  });
  const handleSubmit = async (data) => {
    if (data.serviceTimeSlots.every((slot) => slot.slots.length === 0)) {
      toast({
        title: "Please add time slot",
        variant: "destructive",
      });
      return;
    }
    let temp = [];
    const timeSlotField = form.watch("serviceTimeSlots");
    timeSlotField.forEach((field, index) => {
      field.slots.forEach((slot, idx) => {
        dateOfWeek.forEach((day, i) => {
          if (index === i) {
            if (!slot) {
              toast({
                title: `Lack of time start on ${day.dateOfWeek}`,
                description: `Please fill availability`,
                variant: "destructive",
              });
            }

            temp.push({
              start_time: slot,
              day_of_week: day.dateOfWeek,
            });
          }
        });
      });
    });
    if (data.serviceDistanceRule.length === 0) {
      toast({
        title: "Please add distance rule",
        variant: "destructive",
      });
      return;
    }
    const body = {
      ...data,
      duration: data.duration,
      price: data.price,
      serviceImages: files?.map((file) => ({
        link: file,
      })),
      serviceTimeSlots: temp,
    };
    console.log({ body });

    const result = await updateService({ id, body });
    if (result.error) {
      toast({
        title: "UpdateUpdate service fail",
      });
      return;
    }
    toast({
      title: "Update service sucessfully",
    });
  };
  if (isLoading || isGettingMyService) return <LoadingScreen />;

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit, (err) => {
            console.log(err);
          })}
        >
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Update Service</CardTitle>
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
                  "item-7",
                  "item-8",
                ]}
              >
                {/* Basic Info */}
                <BasisInformation
                  categories={categories && categories}
                  form={form}
                />

                {/* Detail and service steps*/}

                <UpdateServiceDetail
                  form={form}
                  fields={fields}
                  remove={remove}
                  append={append}
                />
                {/* Pricing  */}
                <UpdateServicePrice form={form} />

                {/* Availability  */}
                <UpdateServiceAvailability
                  form={form}
                  dateOfWeek={dateOfWeek}
                  setDateOfWeek={setDateOfWeek}
                />
                {/* Gallery  */}
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg text-primary">
                    Gallery
                  </AccordionTrigger>
                  <AccordionContent>
                    <DragAndDropUpload files={files} setFiles={setFiles} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-lg text-primary">
                    Distance Rule
                  </AccordionTrigger>
                  <AccordionContent>
                    <HousekeeperDistanceRule
                      form={form}
                      append={ruleAppend}
                      remove={ruleRemove}
                      fields={ruleFields}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* additional Service */}
                <UpdateServiceAdditionalService
                  form={form}
                  additionalAppend={additionalAppend}
                  additionalRemove={additionalRemove}
                  additionalFields={additionalFields}
                />
              </Accordion>
            </CardContent>
            <CardFooter className="justify-end">
              <Button disabled={isUpdating} type="submit">
                Submit
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

export default HousekeeperUpdateService;
