import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import Logo from "@/components/Logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formSchema = z
  .object({
    email: z.string().email(),
    token: z.string(),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || ""
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      token,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (values) => {
    const { email, token, newPassword } = values;
    const result = await resetPassword({ email, token, newPassword });

    if (result.error) {
      console.log(result.error);
      toast({
        title: "Password Reset Fail",
        description: result.error.data.messages.IdentityErrors[0],
      });
      return;
    }
    toast({
      title: "Password Reset Successful",
      description: "You can now log in with your new password.",
    });
    nav('/login')
  };

  return (
    <div>
      <Link to="/" className="flex justify-center mt-8">
        <Logo />
      </Link>
      <div className="flex justify-center items-center h-[70vh] px-4">
        <Form {...form} className="flex flex-col items-center justify-center">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800"
          >
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
                Reset Password
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter your new password below.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="w-full bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Password
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter new password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm Password
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className={`${isLoading && "pointer-events-none"} w-full`}
                variant={isLoading ? "secondary" : ""}
              >
                {isLoading && <Loader2 className="animate-spin" />} Reset
                Password
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
