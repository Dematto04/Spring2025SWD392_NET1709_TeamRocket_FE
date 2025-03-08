import React, { useCallback, useState } from "react";
import { useLazyAutoCompleteAddressQuery } from "@/redux/api/addressApi";
import { debounce } from "lodash";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";

function AutoComplete({ form }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [getAddress, { isLoading }] = useLazyAutoCompleteAddressQuery();

  const handleInputChange = useCallback(
    debounce(async (value) => {
      if (value.length > 2) {
        const result = await getAddress({ input: value });
        setDropdownOptions(result.data.predictions || []);
      }
    }, 500),
    []
  );

  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "min-w-[300px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? dropdownOptions.find(
                        (address) => address.place_id === field.value
                      )?.description || "Select your location"
                    : "Select your location"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
              <Command className="">
                <Input
                  placeholder="Type in your address"
                  className="h-9 "
                  onChange={(e) => handleInputChange(e.target.value)}
                />
                <CommandList className="">
                  <CommandEmpty>No address found.</CommandEmpty>

                  <CommandGroup className="">
                    {dropdownOptions.map((address) => (
                      <CommandItem
                        key={address.place_id}
                        value={address.place_id}
                        onSelect={() => {
                          form.setValue("location", address.place_id);
                          form.setValue("city", 
                            address.compound.province,
                          );
                          form.setValue("district",
                             address.compound.district,
                          );
                          form.setValue("address_line",
                             address.description,
                          );
                          form.setValue("place_id",
                             address.place_id,
                          );
                          setIsOpen(false);
                        }}
                      >
                        {address.description}
                        <Check
                          className={cn(
                            "ml-auto",
                            address.place_id === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>
            This is the address that will be shown in your service.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default AutoComplete;
