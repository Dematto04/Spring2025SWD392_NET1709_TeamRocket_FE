import { FilterIcon, Star } from "lucide-react";
import React from "react";
import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Slider } from "../ui/slider";

const items = [
  {
    id: "recents",
    label: "Recents",
  },
  {
    id: "home",
    label: "Home",
  },
  {
    id: "applications",
    label: "Applications",
  },
  {
    id: "desktop",
    label: "Desktop",
  },
  {
    id: "downloads",
    label: "Downloads",
  },
  {
    id: "documents",
    label: "Documents",
  },
];
export default function Filter() {
  const form = useForm({
    defaultValues: {
      keyword: "",
      items: [],
      location: "",
      prices: [0, 100],
      rating: [5],
    },
  });
  const handleSubmit = (data) => {
    console.log(data);
  };
  return (
    <Form {...form} className="w-full">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4">
        {/* filter header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <FilterIcon />
            <span className="text-xl font-bold">Filters</span>
          </div>
          <div className="hover:text-primary duration-200 font-medium cursor-pointer">
            Reset Filter
          </div>
        </div>
        <Separator className="my-4" />
        {/* filter search */}
        <FormField
          control={form.control}
          name="keyword"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="keyword">Search by keyword</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="keyword"
                  placeholder="What are you looking for?"
                  className="h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Category filter */}
        <Accordion collapsible="true" type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-bold">
              Category
            </AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="items"
                render={() => (
                  <FormItem>
                    {items.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="items"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
          {/* location filter */}
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl font-bold">
              Location
            </AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        id="location"
                        placeholder="What are you looking for?"
                        className="h-11 focus-visible:ring-transparent"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
          {/* price filter */}
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xl font-bold">
              Price Range
            </AccordionTrigger>
            <AccordionContent className="mt-2">
              <FormField
                control={form.control}
                name="prices"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Slider
                        defaultValue={[1, 20]}
                        max={100}
                        step={1}
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <div className="flex gap-2">
                      <div>Prices: </div>

                      <div className="flex gap-1">
                        <span>${field.value[0]}</span>
                        <span>-</span>
                        <span>${field.value[1]}</span>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-xl font-bold">
              Rating
            </AccordionTrigger>
            <AccordionContent>
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    {Array(5)
                      .fill(0)
                      .map((_, idx) => {
                        const ratingValue = 5- idx;
                        return (
                          <FormItem
                            key={idx}
                            className="flex items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(ratingValue)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        ratingValue,
                                      ])
                                    : field.onChange(
                                        field.value.filter(
                                          (value) => value !== ratingValue
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal w-full">
                              <div className="flex">
                                {Array(5 - idx)
                                  .fill(1)
                                  .map((_, i) => (
                                    <Star
                                      fill="#ffc107"
                                      key={i}
                                      color="#ffc107"
                                    />
                                  ))}
                              </div>
                            </FormLabel>
                          </FormItem>
                        );
                      })}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button className="w-full">Search</Button>
      </form>
    </Form>
  );
}
