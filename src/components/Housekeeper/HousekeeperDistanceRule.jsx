import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function HousekeeperDistanceRule({
  form,
  append,
  remove,
  fields,
}) {
  const serviceDistanceRule = form.watch("serviceDistanceRule") || [];

  useEffect(() => {
    serviceDistanceRule.forEach((rule, index) => {
      if (index < serviceDistanceRule.length - 1) { 
        form.setValue(
          `serviceDistanceRule.${index + 1}.min_distance`,
          String(parseFloat(rule.max_distance) + 1) || 0
        );
      }
    });
  }, [serviceDistanceRule, form]);

  const handleAddRule = async () => {
    const isValid = await form.trigger("serviceDistanceRule");
    if (isValid) {
      const lastMaxDistance =
        serviceDistanceRule.length > 0
          ? parseFloat(serviceDistanceRule[serviceDistanceRule.length - 1]?.max_distance)
          : 0;

      append({
        min_distance: lastMaxDistance,
        max_distance: 0,
        base_fee: 0,
      });
    }
  };

  return (
    <>
      {fields.map((rule, index) => (
        <Card key={rule.id} className="mb-4">
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name={`serviceDistanceRule.${index}.min_distance`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Min Distance</FormLabel>
                  <FormControl>
                    <Input type="number" {...field}  />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`serviceDistanceRule.${index}.max_distance`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Max Distance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value || 0;
                        field.onChange(value);
                        if (index < serviceDistanceRule.length - 1) {
                          form.setValue(
                            `serviceDistanceRule.${index + 1}.min_distance`,
                            value
                          );
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`serviceDistanceRule.${index}.base_fee`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Fee</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ))}
      <Button type="button" onClick={handleAddRule}>
        Add Rule
      </Button>
    </>
  );
}
