import { CirclePlus, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadFilesMutation } from "@/redux/api/uploadFileApi";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const minuteHandle = (min) => {
  if (min < 60) {
    return min + " min";
  }
  const hour = Math.floor(min / 60);
  const remainMin = min % 60 ? `${min % 60}min` : "";
  return `${hour}h ${remainMin}`;
};
function AddServiceAdditionalService({
  form,
  additionalRemove,
  additionalAppend,
  additionalFields,
}) {
  return (
    <AccordionItem value="item-6">
      <AccordionTrigger className="text-lg text-primary">
        Additional Service
      </AccordionTrigger>
      <AccordionContent>
        {additionalFields?.map((field, idx) => (
          <div
            key={field.id}
            className="flex flex-wrap justify-start items-start w-full gap-6 my-4"
          >
            <FormField
              control={form.control}
              name={`additionalServices.${idx}.url`}
              render={({ field }) => (
                <FormItem className="basis-32 min-h-32">
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onChange={field.onChange}
                      value={field.value}
                      index={idx}
                      form={form}
                    />
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
                    <Input {...field} placeholder="Additional service name" />
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
                    <Input {...field} type="number" min="1" placeholder="Additional service price" />
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
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                      }}
                      defaultValue={field.value?.toString()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {[15, 30, 45, 60, 75, 90, 105, 120].map((value) => (
                          <SelectItem key={value} value={value.toString()}>
                            {minuteHandle(value)}
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
            <FormField
              control={form.control}
              name={`additionalServices.${idx}.description`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Additional service description"
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
          onClick={() => {
            additionalAppend({
              additionalImage: "",
              additional_service_name: "",
              amount: "",
              duration: "",
            });
          }}
          variant="outline"
          type="button"
        >
          <CirclePlus />
          <span>Add New</span>
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}

function ImageUpload({ onChange, value, maxFiles = 10, index, form }) {
  const [files, setFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [upload, { isLoading }] = useUploadFilesMutation();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > maxFiles) {
        toast({
          title: `Only ${maxFiles} file allowed!`,
          description: `Max images is ${maxFiles}.`,
          variant: "destructive",
          duration: 2000,
        });
      }

      const formData = new FormData();
      acceptedFiles.forEach((file) => formData.append("files", file));
      const response = await upload(formData);
      const imgUrl = response?.data?.data?.map((url) => url)[0];
      setPreviewUrl(imgUrl);
      form.setValue(`additionalServices.${index}.url`, imgUrl);
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-dashed border-2 p-4 text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="max-w-full h-auto" />
      ) : (
        <p>Drag & drop an image here, or click to select one</p>
      )}
    </div>
  );
}

export default AddServiceAdditionalService;
