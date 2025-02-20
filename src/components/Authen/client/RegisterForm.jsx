import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../ui/form";
import { Label } from "../../ui/label";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useCustomerRegisterMutation } from "@/redux/api/authApi";
import { LoaderCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid Email" }),
    fullname: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .regex(
        /^[\p{L}]+(?: [\p{L}]+)*$/u,
        "Special characters, numbers are not allowed and trailing spaces not allow"
      ),
    phoneNumber: z
      .string()
      .regex(/^\d{10,11}$/, "Phone number must be 10-11 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullname: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [registerMutation, { isLoading }] = useCustomerRegisterMutation();
  const [open, setOpen] = useState(false);

  //  handle register
  const handleRegister = async (values) => {
    const { setError } = form;
    const result = await registerMutation(values);

    if (result.error) {
      const errors = result.error.data.messages;
      if (errors.DuplicateEmail) {
        setError("email", { message: errors.DuplicateEmail[0] });
      }
      return;
    }
    console.log(result);
    setOpen(true);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegister)}
        className="flex flex-col gap-6"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold">Register your account</h1>
        </div>

        <div className="grid gap-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="your.email@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*  Fullname Field */}
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <Label>Full Name</Label>
                <FormControl>
                  <Input {...field} placeholder="Nguyen Van A" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number  */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <Label>Phone Number</Label>
                <FormControl>
                  <Input {...field} placeholder="Enter your phone number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label>Password</Label>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password  */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <Label>Confirm Password</Label>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Confirm your password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Register Button */}
          <Button
            type="submit"
            className={`${isLoading && "pointer-events-none"} w-full`}
            variant={isLoading ? "secondary" : ""}
          >
            {isLoading && <LoaderCircle className="animate-spin" />} Register
          </Button>

          {/*  Links */}
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
          <div className="text-center text-sm">
            <Link to="/register-housekeeper">Join us as a housekeeper!</Link>
          </div>
        </div>
      </form>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Please check your email.</DialogTitle>
            <DialogDescription>
              Please check your inbox to verify your account.
            </DialogDescription>
          </DialogHeader>
          <div>
            We have sent you an email with a verification link. Please click the
            link to complete your account confirmation.
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Ok</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}

export default RegisterForm;
