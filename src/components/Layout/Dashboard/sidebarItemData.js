import {
    BriefcaseBusiness,
    CalendarDays,
    CircleDollarSign,
    CirclePlus,
    LayoutDashboard,
    Wallet,
    Calendar,
    ClipboardList,
    Users,
    Building2,
    List,
  } from "lucide-react";

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  //Housekeeper routes
  navHousekeeper: [
    {
      title: "Dashboard",
      url: "/dashboard/housekeeper",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Calendar",
      url: "/dashboard/housekeeper/calendar",
      icon: Calendar,
    },
    {
      title: "Add service",
      url: "/dashboard/housekeeper/add-service",
      icon: CirclePlus,
    },
    {
      title: "My Services",
      url: "/dashboard/housekeeper/my-service",
      icon: BriefcaseBusiness,
    },
    {
      title: "Booking List",
      url: "/dashboard/housekeeper/booking-list",
      icon: CalendarDays,
    },
    {
      title: "Wallet",
      url: "/dashboard/housekeeper/wallet",
      icon: Wallet,
    },
    {
      title: "Earning",
      url: "/dashboard/housekeeper/earning",
      icon: CircleDollarSign,
    },
  ],

  //Staff routes
  navStaff: [
    {
      title: "Dashboard",
      url: "/dashboard/staff",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Service Request",
      url: "/dashboard/staff/requests",
      icon: CirclePlus,
    },
    {
      title: "Withdraw Request",
      url: "/dashboard/staff/withdraw-request",
      icon: ClipboardList,
    },
  ],

  //Admin routes
  navAdmin: [
    {
      title: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "User Management",
      url: "/dashboard/admin/user-management",
      icon: Users,
    },
    {
      title: "Service Management",
      url: "/dashboard/admin/service-management",
      icon: Building2,
    },
    {
      title: "Category Management",
      url: "/dashboard/admin/category-management",
      icon: List,
    },
  ],
};
