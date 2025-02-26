import { DashboardSidebar } from "@/components/Layout/Dashboard/dashboard-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <SidebarProvider >
      <DashboardSidebar />
      <SidebarInset>
        <SidebarTrigger className="-ml-1" />
        <div className="py-4 px-3 md:px-8 bg-secondary h-full">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
