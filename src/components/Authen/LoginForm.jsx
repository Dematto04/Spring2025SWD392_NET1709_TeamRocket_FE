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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "./GoogleIcon";
import { useLoginMutation } from "@/redux/api/authApi";

import { handleError } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { login } from "@/redux/features/authSlice";
import { LoaderCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { loginWithGoogle } from "@/firebase/firebaseHelper";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 6 characters" }),
});

export function LoginForm() {
  const { toast } = useToast();
  const [loginMutation, { isLoading, isError }] = useLoginMutation();
  const dispatch = useDispatch();
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
    console.log(import.meta.env.VITE_API_URL);
    
    const result = await loginMutation(data);
    if (result.error) {
      const error = result.error;
      console.log(error);
      const errorMessage = error.data.messages?.Email ? error.data.messages?.Email[0] : error.data.messages.Credentials[0];
      form.setError("email", {
        message: errorMessage,
      });
      form.setError("password", {
        message: errorMessage,
      });
      if(error.data.messages.Credentials[0]){
        
      }
      return;
    }
    const account = result.data;
    const userData = jwtDecode(account.accessToken);
    console.log(jwtDecode(account.accessToken));
    localStorage.setItem('accessToken', account.accessToken)
    localStorage.setItem('refreshToken', account.refreshToken)
    toast({
      title: "Login sucessfully!",
      description: `Welcome ${userData.name || "User"} 😊`,
    });

    dispatch(
      login({
        user: {
          fullName: userData.name,
          userId: userData.Id,
          email: userData.Email,
          role: account.role,
        },
        userToken: {
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
        },
      })
    );
    nav('/')
  };

  const handleLoginWithGoogle = () => {
    loginWithGoogle();
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
                <Label htmlFor="email">Email</Label>
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
                  <a
                    href="#"
                    className="text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
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
    </Form>
  );
}
