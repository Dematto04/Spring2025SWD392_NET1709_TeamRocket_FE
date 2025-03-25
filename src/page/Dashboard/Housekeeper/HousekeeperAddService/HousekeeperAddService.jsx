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
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { serviceTimeSlots } from "./slotData";
import DragAndDropUpload from "@/components/DragAndDropUpload";
import {
  useCreateServiceMutation,
  useGetCategoriesQuery,
  useGetHousekeeperSkillsQuery,
} from "@/redux/api/serviceApi";
import { toast } from "@/hooks/use-toast";
import AutoComplete from "@/components/AutoComplete";
import HousekeeperDistanceRule from "@/components/Housekeeper/HousekeeperDistanceRule";
import BasisInformation from "@/components/Housekeeper/AddService/BasisInformation";
import LoadingScreen from "@/components/Loading";
import AddServiceDetail from "@/components/Housekeeper/AddService/AddServiceDetail";
import AddServicePrice from "@/components/Housekeeper/AddService/AddServicePrice";
import AddServiceAvailability from "@/components/Housekeeper/AddService/AddServiceAvailability";
import AddServiceAdditionalService from "@/components/Housekeeper/AddService/AddServiceAdditionalService";
import { useNavigate } from "react-router-dom";
import { formSchema } from "./formSchema";


// thiếu field image
function HousekeeperAddService() {
  const [dateOfWeek, setDateOfWeek] = useState(serviceTimeSlots);
  const [files, setFiles] = useState([]);
  const nav = useNavigate();
  //api cateogry
  const { data: categories, isLoading } = useGetHousekeeperSkillsQuery({
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });
  //api create service

  const [createService, { isSuccess, isLoading: isCreating }] =
    useCreateServiceMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service_name: "",
      category_id: "",
      description: "",
      duration: "",
      price: 0,
      serviceSteps: [{ step_order: 1, step_description: "", step_duration: null }],
      additionalServices: [],
      // city: "",
      // province: "",
      // address_line: "",
      // place_id: "",
      // location: "",
      serviceDistanceRule: [],
      serviceTimeSlots: [],
    },
  });
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

    const body = {
      ...data,
      duration: data.duration,
      price: data.price,
      serviceImages: files?.map((file) => ({
        link: file,
      })),
      serviceTimeSlots: temp,
    };
    console.log({body});
    

    if (data.serviceDistanceRule.length === 0) {
      toast({
        title: "Please add distance rule",
        variant: "destructive",
      });
      return;
    }
    const result = await createService(body);
    if (result.error) {
      toast({
        title: "Create service fail",
      });
      return;
    }
    toast({
      title: "Create service sucessfully",
      duration: 1000,
    });
    nav("/dashboard/housekeeper/my-service");
  };
  if (isLoading) return <LoadingScreen />;

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
                  "item-7",
                ]}
              >
                {/* Basic Info */}
                <BasisInformation
                  categories={categories && categories}
                  form={form}
                />

                {/* Detail and service steps*/}

                <AddServiceDetail
                  form={form}
                  fields={fields}
                  remove={remove}
                  append={append}
                />
                {/* Pricing  */}
                <AddServicePrice form={form} />

                {/* Availability  */}
                <AddServiceAvailability
                  form={form}
                  dateOfWeek={dateOfWeek}
                  setDateOfWeek={setDateOfWeek}
                />
                {/* Location  */}
                {/* <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg text-primary">
                    Location
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap w-full gap-6 p-2">
                      <AutoComplete form={form} />
                    </div>
                  </AccordionContent>
                </AccordionItem> */}
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
                <AddServiceAdditionalService
                  form={form}
                  additionalAppend={additionalAppend}
                  additionalRemove={additionalRemove}
                  additionalFields={additionalFields}
                />
              </Accordion>
            </CardContent>
            <CardFooter className="justify-end">
              <Button disabled={isCreating}>Submit</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

export default HousekeeperAddService;
