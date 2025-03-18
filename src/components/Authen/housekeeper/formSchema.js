import { z } from "zod";

const housekeeperRegisterFormSchema = {
  register: z
    .object({
      email: z.string().email({
        message: "Invalid Email",
      }),
      password: z.string().min(6, "Password must at least 6 characters"),
      confirmPassword: z.string().min(4),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
          path: ["confirmPassword"],
        });
      }
    }),
  self: z.object({
    fullName: z.string().min(1, "Full name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    phone: z.string().min(1, "Phone number is required"),
    location: z.string().min(1, "Address is required"),
    services: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
  }),
};

export default housekeeperRegisterFormSchema;
