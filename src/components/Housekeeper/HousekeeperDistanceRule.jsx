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
import { Trash2 } from "lucide-react";

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
          String(parseFloat(rule.max_distance)) || 0
        );
      }
    });
  }, [serviceDistanceRule, form]);

  const handleAddRule = async () => {
    const isValid = await form.trigger("serviceDistanceRule");
    if (isValid) {
      const lastMaxDistance =
        serviceDistanceRule.length > 0
          ? parseFloat(
              serviceDistanceRule[serviceDistanceRule.length - 1]?.max_distance
            )
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
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <FormField
              control={form.control}
              name={`serviceDistanceRule.${index}.min_distance`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Min Distance (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      readOnly={index > 0}
                      {...field}
                    />
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
                  <FormLabel>Max Distance (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      min={1}
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
                  <FormLabel>Fee ($USD)</FormLabel>
                  <FormControl>
                    <Input min={1} type="number" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(index)}
              className="mt-6"
            >
              <Trash2 size={18} color="red" />
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button type="button" onClick={handleAddRule}>
        Add Rule
      </Button>
    </>
  );
}
