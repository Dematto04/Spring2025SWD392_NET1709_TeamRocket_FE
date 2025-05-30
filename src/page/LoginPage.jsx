import { LoginForm } from "@/components/Authen/LoginForm";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LoginPage() {

  return (
    <div className="grid max-h-svh h-full lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="gap-2 flex justify-between">
          <Link to="/" className="flex  items-center gap-2 font-medium">
            <Logo />
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm/>
          </div>
        </div>
      </div>
      <div className="hidden lg:block min-h-screen h-full">
        <img
          src="/login.webp"
          alt="Image"
          className="inset-0 h-full w-full object-cover dark:brightness-[0.6]"
        />
      </div>
    </div>
  );
}
