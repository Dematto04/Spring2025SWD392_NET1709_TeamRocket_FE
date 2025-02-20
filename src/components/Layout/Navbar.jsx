import { Link, useNavigate } from "react-router-dom";

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
import { isUserAuth, logout, selectUser } from "@/redux/features/authSlice";
import { Button } from "../ui/button";
import { NavbarUser } from "./NavbarUser";
import { CircleUserRound } from "lucide-react";
import Logo from "../Logo";


export default function Navbar({services}) {
  const isAuth = useSelector(isUserAuth);
  const user = useSelector(selectUser)

  
  const dispatch = useDispatch();
  const nav = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    nav("/login");
  };
  console.log({services});
  
  return (
    <NavigationMenu className="px-3 h-20 flex items-center justify-between fixed bg-background rounded-br-2xl rounded-bl-rounded-br-2xl shadow-sm">
      <NavigationMenuList>
        <Link to="/">
          <NavigationMenuItem className="mr-6">
            <Logo />
          </NavigationMenuItem>
        </Link>
        <Link to="/">
          <NavigationMenuItem className={navigationMenuTriggerStyle()}>
            Home
          </NavigationMenuItem>
        </Link>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Services</NavigationMenuTrigger>
          {/* navbar items */}
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-screen grid-cols-8">
              {services.map((service, idx) => (
                <li key={idx} className="col-span-2 xl:col-span-1">
                  <Link
                    className="group flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    to={`/service/intro/${service.name}/${service.id}`}
                  >
                    <div className="overflow-hidden">
                      <img
                        loading="lazy"
                        src={service.image}
                        className="duration-200 group-hover:scale-110 h-full w-full object-contain"
                      />
                    </div>
                    <div className="mb-2 mt-4 text-lg font-medium">
                      {service.name}
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      {service.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <Link to="/blogs">
          <NavigationMenuItem className={navigationMenuTriggerStyle()}>Blogs</NavigationMenuItem>
        </Link>
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem>
          <div className="flex gap-3">
            {isAuth ? (
              <NavbarUser onSignOut={handleLogout} user={user}/>
            ) : (
              <div className="flex gap-3">
                <Link to="/register">
                  <Button variant="outline">
                    <CircleUserRound className="mr-2" /> Register
                  </Button>
                </Link>
                <Link to="/login">
                  <Button>
                    <CircleUserRound className="mr-2" />
                    Login
                  </Button>
                </Link>
              </div>
            )}
            <ThemeToggle />
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// const ListItem = forwardRef(({ className, title, children, ...props }, ref) => {
//   return (
//     <li>
//       <NavigationMenuLink asChild>
//         <a
//           ref={ref}
//           className={cn(
//             "block select-none space-y-1 rounded-md p-3 leadingduration-200 -none no-underline outline-none -colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//             className
//           )}
//           {...props}
//         >
//           <div className="text-sm font-medium leading-none">{title}</div>
//           <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//             {children}
//           </p>
//         </a>
//       </NavigationMenuLink>
//     </li>
//   );
// });
// ListItem.displayName = "ListItem";
