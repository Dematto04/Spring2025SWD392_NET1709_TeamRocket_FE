import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import RegisterForm from "@/components/Authen/client/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="grid max-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="gap-2 flex justify-between">
          <Link to="/" className="flex  items-center gap-2 font-medium">
            <Logo />
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="hidden lg:block h-screen">
        <img
          src="/register-img.webp"
          alt="Image"
          className="inset-0 h-full w-full object-cover dark:brightness-[0.6]"
        />
      </div>
    </div>
  );
}
