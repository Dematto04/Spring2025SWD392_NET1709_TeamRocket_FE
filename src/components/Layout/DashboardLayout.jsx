import { DashboardSidebar } from "@/components/Layout/Dashboard/dashboard-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetHousekeeperProfileQuery } from "@/redux/api/meApi";
import { Card } from "@/components/ui/card";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function DashboardLayout() {
  const { user } = useSelector((state) => state.auth);
  console.log({ user });

  const {
    data: housekeeper,
    isSuccess,
  } = useGetHousekeeperProfileQuery();

  const StatusCard = ({ icon: Icon, title, description, variant = "default" }) => (
    <Card className="max-w-2xl mx-auto mt-8">
      <div className="p-8 text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          variant === "default" ? "bg-primary/10 text-primary" :
          variant === "warning" ? "bg-yellow-100 text-yellow-600" :
          "bg-red-100 text-red-600"
        }`}>
          <Icon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Card>
  );

  return (
    <>
      {user?.role !== "Housekeeper" && (
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset>
            <SidebarTrigger className="-ml-1" />
            <div className="py-4 px-3 md:px-8 bg-secondary h-full">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      )}
      {user?.role === "Housekeeper" &&
        isSuccess &&
        housekeeper?.data?.housekeeper_status === "Approved" && (
          <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
              <SidebarTrigger className="-ml-1" />
              <div className="py-4 px-3 md:px-8 bg-secondary h-full">
                <Outlet />
              </div>
            </SidebarInset>
          </SidebarProvider>
        )}
      {user?.role === "Housekeeper" &&
        isSuccess &&
        housekeeper?.data?.housekeeper_status === "Pending" && (
          <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
              <SidebarTrigger className="-ml-1" />
              <div className="py-4 px-3 md:px-8 bg-secondary h-full">
                <StatusCard
                  icon={Clock}
                  title="Registration Under Review"
                  description="Your registration is currently being reviewed by our staff. We'll notify you once a decision has been made. This process typically takes 1-2 business days."
                  variant="warning"
                />
              </div>
            </SidebarInset>
          </SidebarProvider>
        )}
      {user?.role === "Housekeeper" &&
        isSuccess &&
        housekeeper?.data?.housekeeper_status === "Rejected" && (
          <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
              <SidebarTrigger className="-ml-1" />
              <div className="py-4 px-3 md:px-8 bg-secondary h-full">
                <StatusCard
                  icon={AlertCircle}
                  title="Registration Rejected"
                  description="We regret to inform you that your registration request has been rejected. Please contact our support team for more information about the rejection reason and how to proceed."
                  variant="destructive"
                />
              </div>
            </SidebarInset>
          </SidebarProvider>
        )}
    </>
  );
}
