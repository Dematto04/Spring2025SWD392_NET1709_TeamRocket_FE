import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "./GoogleIcon";
import { useLoginMutation, useResendEmailMutation } from "@/redux/api/authApi";

import { useDispatch } from "react-redux";
import { login } from "@/redux/features/authSlice";
import { LoaderCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { loginWithGoogle } from "@/firebase/firebaseHelper";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 6 characters" }),
});

export function LoginForm() {
  const { toast } = useToast();
  const [loginMutation, { isLoading }] = useLoginMutation();
  const [resendEmail, { isLoading: isSending }] = useResendEmailMutation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState();
  const [email, setEmail] = useState("");
  const nav = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  //handle login
  const handleLogin = async (data) => {
    const result = await loginMutation(data);
    if (result.error) {
      const error = result.error;
      console.log(error);
      let errorMessage = error.data?.messages?.Email
        ? error.data?.messages?.Email[0]
        : error.data?.messages.Credentials[0];
      if (!errorMessage) {
        errorMessage = "Server Error";
      }
      form.setError("email", {
        message: errorMessage,
      });
      form.setError("password", {
        message: errorMessage,
      });
      return;
    }
    const account = result.data;
    const userData = jwtDecode(account.accessToken);
    localStorage.setItem("accessToken", account.accessToken);
    localStorage.setItem("refreshToken", account.refreshToken);
    toast({
      title: "Login sucessfully!",
      description: `Welcome ${userData.name || "User"} 😊`,
    });

    dispatch(
      login({
        user: {
          fullName: userData.name,
          userId: userData.id,
          email: userData.email,
          role: userData.role,
        },
        userToken: {
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
        },
      })
    );

    nav("/");
  };

  const handleLoginWithGoogle = () => {
    loginWithGoogle();
  };
  const handleConfirmEmail = async () => {
    const result = await resendEmail({ email });
    if (result.error) {
      console.log(result.error);
      toast({
        title: "Email already confirmed",
        description: "Please Login",
      });
      return;
    }
    toast({
      title: "Send email successfully",
      description: "Please check your inbox",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleLogin)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <div className="grid gap-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Email</Label>
                  <Link
                    className="text-sm underline-offset-4 hover:underline"
                    onClick={() => setOpen(true)}
                  >
                    Verify your email here!
                  </Link>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                  />
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Enter your password"
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
            {isLoading && <LoaderCircle className="animate-spin" />} Login
          </Button>

          <div className="relative text-center text-sm">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            type="button"
            onClick={handleLoginWithGoogle}
          >
            <GoogleIcon />
            <span className="ml-2">Login with Google</span>
          </Button>
        </div>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline underline-offset-4">
            Register
          </Link>
        </div>
      </form>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Email verification</DialogTitle>
            <DialogDescription>
              We'll send you an email with a verification link. Please click the
              link to complete your account confirmation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-3">
              <Label className="text-right">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className={`${isSending && "pointer-events-none"}`}
              variant={isSending ? "secondary" : ""}
              onClick={handleConfirmEmail}
            >
              {isSending && <LoaderCircle className="animate-spin" />} Send
              Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
