import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import AutoComplete from "@/components/AutoComplete";
import { useGetCategoriesQuery } from "@/redux/api/serviceApi";

export default function HousekeeperSelfForm({ form }) {
  const { data: services, isSuccess } = useGetCategoriesQuery();
  const hehe = form.watch("services");
  console.log(hehe);
  return (
    isSuccess && (
      <Form
        {...form}
        className="max-w-xl mx-auto space-y-6 p-6 border rounded-lg shadow-md"
      >
        <form className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-y-5 mt-5">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123-456-7890" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <AutoComplete form={form} defaultAddress={form.getValues("address_line")} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Services</FormLabel>
                    <FormDescription>
                      Select the services you want to apply.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-4 gap-y-6">
                    {services?.data?.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="services"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="col-span-2 lg:col-span-1 flex flex-wrap flex-row items-start space-x-3 space-y-0"
                            >
                              <div className="flex items-center gap-1">
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
                                  {item.name}
                                </FormLabel>
                              </div>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    )
  );
}
