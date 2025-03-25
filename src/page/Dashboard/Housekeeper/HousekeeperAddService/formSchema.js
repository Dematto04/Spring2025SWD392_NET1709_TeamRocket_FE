import { z } from "zod";

export const formSchema = z.object({
    service_name: z.string().min(1, { message: "Service name is required" }),
    category_id: z.string().min(1, { message: "Service name is required" }),
    description: z
      .string()
      .min(1, { message: "Service description is required" })
      .max(2000, { message: "Max characters is 2000" }),
    duration: z.string().min(1, { message: "Service duration is required" }),
    price: z.string().min(1, { message: "Service price is required" }),
    serviceSteps: z.array(
      z.object({
        step_order: z.number(),
        step_description: z.string().min(1, "Description is required"),
        step_duration: z
          .number()
          .gt(0, { message: "Duration have to greater than 0" }),
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
    // city: z.string().min(1, { message: "City is required" }),
    // district: z.string().min(1, { message: "District is required" }),
    // address_line: z.string().min(1, { message: "Address is required" }),
    // place_id: z.string(),
    // location: z.string().min(1, { message: "Location is required" }),
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