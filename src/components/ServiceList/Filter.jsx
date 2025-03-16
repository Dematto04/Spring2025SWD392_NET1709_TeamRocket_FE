import { FilterIcon, Star } from "lucide-react";
import React, { useEffect } from "react";
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
import { useGetFilterOptionsQuery } from "@/redux/api/serviceApi";
import { useSearchParams } from "react-router-dom";
import AutoComplete from "../AutoComplete";
import { set } from "lodash";

export default function Filter({ filter, setFilter }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const form = useForm({
    defaultValues: {
      search: "",
      location: "",
      prices: [0, 100],
      ratings: null,
      categoryIds: category ? [category] : [],
    },
  });
  const {
    data: filterOptions,
    isSuccess,
    isLoading,
  } = useGetFilterOptionsQuery();
  const handleSubmit = (data) => {
    console.log(data);
    setFilter({
      ...data,
      userPlaceId: data.location,
    });
  

  };
  useEffect(() => {
    if (isSuccess) {
      form.setValue("prices", [
        filterOptions?.data?.minPrice,
        filterOptions?.data?.maxPrice,
      ]);
      form.setValue("categoryIds", category ? [category] : []);   
    }
  }, [isSuccess]);
  useEffect(() => {
    form.reset({
      search: "",
      location: "",
      prices: [filterOptions?.data?.minPrice, filterOptions?.data?.maxPrice],
      ratings: null,
      categoryIds: category ? [category] : [],
    });
  }, [searchParams]);
  const resetFilter = () => {
    form.reset({
      search: "",
      location: "",
      prices: [filterOptions?.data?.minPrice, filterOptions?.data?.maxPrice],
      ratings: null,
      categoryIds: category ? [category] : [],
    });

  };
  return (
    isSuccess && (
      <Form {...form} className="w-full">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4">
          {/* filter header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <FilterIcon />
              <span className="text-xl font-bold">Filters</span>
            </div>
            <div
              onClick={resetFilter}
              className="hover:text-primary duration-200 font-medium cursor-pointer"
            >
              Reset Filter
            </div>
          </div>
          <Separator className="my-4" />
          {/* filter search */}
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="search">Search by search</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="search"
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
                  name="categoryIds"
                  render={() => (
                    <FormItem>
                      {filterOptions?.data?.categories.map((cate) => (
                        <FormField
                          key={cate.id}
                          control={form.control}
                          name="categoryIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={cate.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(cate.id)}
                                    onCheckedChange={(checked) => {
                                      const currentValue = field.value || [];
                                      return checked
                                        ? field.onChange([
                                            ...currentValue,
                                            cate.id,
                                          ])
                                        : field.onChange(
                                            currentValue.filter(
                                              (value) => value !== cate.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {cate.name}
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
                        <AutoComplete form={form} />
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
                          max={filterOptions?.data?.maxPrice}
                          min={filterOptions?.data?.minPrice}
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
                  name="ratings"
                  render={({ field }) => (
                    <FormItem>
                      {filterOptions?.data?.ratingOptions.map((rating) => (
                        <div
                          key={rating.range}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            checked={field.value?.includes(rating.range)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              field.onChange(
                                checked
                                  ? [...currentValue, rating.range]
                                  : currentValue.filter(
                                      (value) => value !== rating.range
                                    )
                              );
                            }}
                          />
                          <FormLabel className="text-sm font-normal">
                            {rating.range} Star ({rating.count} rate)
                          </FormLabel>
                        </div>
                      ))}
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
    )
  );
}
