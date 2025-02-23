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

// This is sample data.


export function DashboardSidebar({ ...props }) {
  const [clickedItem, setClickedItem] = React.useState("Dashboard")
  const { theme } = useTheme();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex justify-between items-center">
          <Logo className={theme === "dark" && "mix-blend-lighten"} />
          <div>
            <ThemeToggle />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} clickedItem={clickedItem} setClickedItem={setClickedItem}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
