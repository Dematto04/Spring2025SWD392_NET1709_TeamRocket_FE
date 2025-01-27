import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { forwardRef } from "react";
import { ThemeToggle } from "../ui/theme-toggle";
import { useDispatch, useSelector } from "react-redux";
import { isUserAuth, login, logout } from "@/redux/features/authSlice";
import { SidebarUser } from "./SidebarUser";
import { Button } from "../ui/button";
import { NavbarUser } from "./NavbarUser";
import { CircleUserRound } from "lucide-react";
import Logo from "../Logo";

export default function Navbar() {
  const isAuth = useSelector(isUserAuth);
  const dispatch = useDispatch();
  const handleLogin = () => {
    dispatch(
      login({
        user: {
          name: "long",
          age: 20,
        },
        userToken: {
          hehe: "123",
        },
      })
    );
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <NavigationMenu className="px-3 h-20 flex items-center justify-between">
      <NavigationMenuList>
        <NavigationMenuItem className="mr-6">
          <Logo/>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Services</NavigationMenuTrigger>
          {/* navbar items */}
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-screen md:grid-cols-4">
              <li className="">
                <NavigationMenuLink asChild href="/service/home-cleaning">
                  <Link
                    className="group flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    to="/service/home-cleaning"
                  >
                    <div className="overflow-hidden ">
                      <img
                        loading="lazy"
                        src="/public/home-cleaning.jpg"
                        className="duration-200 group-hover:scale-110 h-full w-full object-contain"
                      />
                    </div>
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Home Cleaning
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Spotless homes, effortless living!
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li className="">
                <NavigationMenuLink asChild>
                  <Link
                    className="group flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="overflow-hidden">
                      <img
                        loading="lazy"
                        src="/public/ac-cleaning.jpg"
                        className="duration-200 group-hover:scale-110 h-full w-full object-contain"
                      />
                    </div>
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Air Conditioner Cleaning
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Cool, clean, and fresh air!
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li className="">
                <NavigationMenuLink asChild>
                  <Link
                    className="group flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="overflow-hidden">
                      <img
                        loading="lazy"
                        src="/public/sofa-cleaning.jpg"
                        className="duration-200 group-hover:scale-110 h-full w-full object-contain"
                      />
                    </div>
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Sofa Cleaning
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Fresh sofas, happy homes!
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li className="">
                <NavigationMenuLink asChild>
                  <Link
                    className="group flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="overflow-hidden">
                      <img
                        loading="lazy"
                        src="/public/home-cleaning.jpg"
                        className="duration-200 group-hover:scale-110 h-full w-full object-contain"
                      />
                    </div>
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Your Mom Cleaning
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Fresh sofas, happy homes!
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/blogs">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Blogs
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink>
            {isAuth ? (
              <NavbarUser onSignOut={handleLogout} />
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleLogin}>
                  <CircleUserRound className="mr-2" /> Register
                </Button>
                <Button onClick={handleLogin}>
                  <CircleUserRound className="mr-2" /> 
                  Login
                </Button>
                <ThemeToggle/>
              </div>
            )}
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = forwardRef(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leadingduration-200 -none no-underline outline-none -colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
