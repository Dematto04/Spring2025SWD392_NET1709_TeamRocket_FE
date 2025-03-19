import * as React from "react";

import { NavMain } from "@/components/Layout/Dashboard/nav-main";
import { NavUser } from "@/components/Layout/Dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import { data } from "./sidebarItemData";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import { Link } from "react-router-dom";

// This is sample data.
export function DashboardSidebar({ ...props }) {
  const [clickedItem, setClickedItem] = React.useState(localStorage.getItem("dashboard-item") || "Dashboard");
  const user = useSelector(selectUser);
  let navItem;
  if(!user){
    return null;
  }
  switch(user.role){
    case "Housekeeper":
      navItem = data.navHousekeeper;
      break;
    case "Staff":
      navItem = data.navStaff;
      break;
    default:
      navItem = data.navAdmin;
      break;
  }
  
  const { theme } = useTheme();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex justify-between items-center">
          <Link to="/">
            <Logo className={theme === "dark" && "mix-blend-lighten"} />
          </Link>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={navItem}
          clickedItem={clickedItem}
          setClickedItem={setClickedItem}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
