import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";


import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
const formSchema = z.object({
  email: z.string().email({ message: "Invalid Email" }),
});
export default function ForgotPassword() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const handleSumbit = async (email) => {
    console.log(email);
    const result = await forgotPassword(email);
    if (result.error) {
      form.setError('email', {message: result.error.data.messages.Email[0]})
      return;
    }
    toast({
        title: "Send email successfully",
        description: result.data.messages.Message[0]

    })
  };
  return (
    <div>
      <Link to="/" className="flex justify-center mt-8">
        <Logo />
      </Link>
      <div className="flex justify-center items-center h-[70vh] px-4">
        <Form {...form} className="flex flex-col items-center justify-center">
          <form
            onSubmit={form.handleSubmit(handleSumbit)}
            className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800"
          >
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
                Forgot Password?
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Email Address
                      </Label>

                      <FormControl>
                        <Input
                          {...field}
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                          className="mt-1 w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className={`${isLoading && "pointer-events-none"} w-full`}
                variant={isLoading ? "secondary" : ""}
              >
                {isLoading && <Loader2 className="animate-spin" />} Send Email
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
