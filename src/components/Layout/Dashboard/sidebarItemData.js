import {
    BriefcaseBusiness,
    CalendarDays,
    CircleDollarSign,
    CirclePlus,
    LayoutDashboard,
    Wallet,
  } from "lucide-react";
export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/housekeeper",
      icon: LayoutDashboard,
      isActive: true,
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
};
