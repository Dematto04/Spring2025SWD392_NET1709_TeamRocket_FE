import MainLayout from "@/components/Layout/MainLayout";
import SimpleLayout from "@/components/Layout/SimpleLayout";
import ConfirmEmail from "@/page/ConfirmEmail";
import DashboardAdmin from "@/page/Dashboard/DashboardAdmin";
import DashboardStaff from "@/page/Dashboard/Staff/DashboardStaff";
import ForgotPassword from "@/page/ForgotPassword";
import HomePage from "@/page/HomePage";
import HousekeeperRegisterPage from "@/page/HousekeeperRegisterPage";

import LoginPage from "@/page/LoginPage";
import RegisterPage from "@/page/RegisterPage";
import ResetPassword from "@/page/ResetPassword";
import ServiceListPage from "@/page/ServiceListPage";
import ServiceIntroPage from "@/page/ServiceIntroPage";
import CustomerProfilePage from "@/page/CustomerProfilePage";
import ServiceDetailPage from "@/page/ServiceDetailPage";
import ServiceBookingPage from "@/page/ServiceBookingPage";
import CheckoutPage from "@/page/CheckoutPage";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import HousekeeperDashboard from "@/page/Dashboard/Housekeeper/HousekeeperDashboard";
import HousekeeperAddService from "@/page/Dashboard/Housekeeper/HousekeeperAddService/HousekeeperAddService";
import HousekeeperMyService from "@/page/Dashboard/Housekeeper/HousekeeperMyService/HousekeeperMyService";
import HouseKeeperBookingList from "@/page/Dashboard/Housekeeper/HouseKeeperBookingList";
import HousekeeperWallet from "@/page/Dashboard/Housekeeper/HousekeeperWallet";
import HousekeeperEarning from "@/page/Dashboard/Housekeeper/HousekeeperEarning";
import StaffRequestsPage from "@/page/Dashboard/Staff/StaffRequestsPage";
import RequestDetailPage from "@/page/Dashboard/Staff/RequestDetailPage";
import CheckoutSuccess from "@/page/CheckoutSuccess";
import CheckoutFail from "@/page/CheckoutFail";

const routes = [
  {
    layout: MainLayout,
    children: [
      {
        path: "/",
        component: HomePage,
      },
      {
        path: "/service/intro/:name/:id",
        component: ServiceIntroPage,
      },
      {
        path: "/services",
        component: ServiceListPage,
      },
      {
        path: "/service/:id",
        component: ServiceDetailPage,
      },
      {
        path: "/service/booking/:id",
        component: ServiceBookingPage,
        allowedRoles: ['Customer']
      },
      {
        path: "/service/checkout",
        component: CheckoutPage,
        allowedRoles: ['Customer']
      },
      {
        path: "/profile/customer",
        component: CustomerProfilePage,
        allowedRoles: ['Customer']
      },
      // {
      //   path: "/dashboard/admin",
      //   component: DashboardAdmin,
      //   allowedRoles: ["Admin"],
      // },
      // {
      //   path: "/dashboard/staff",
      //   component: DashboardStaff,
      //   allowedRoles: ["Admin", "Staff"],
      // },
      {
        path: "/service/Checkout/fail",
        component: CheckoutFail,
        allowedRoles: ["Customer"],
      },
      {
        path: "/service/Checkout/success",
        component: CheckoutSuccess,
        allowedRoles: ["Customer"],
      },
     
    ],
  },
  {
    layout: SimpleLayout,
    isRestricted: true,
    children: [
      {
        path: "/login",
        component: LoginPage,
      },
      {
        path: "/register",
        component: RegisterPage,
      },
      {
        path: "/register-housekeeper",
        component: HousekeeperRegisterPage,
      },
      {
        path: "/confirm-email",
        component: ConfirmEmail,
      },
      {
        path: "/forgot-password",
        component: ForgotPassword,
      },
      {
        path: "/reset-password",
        component: ResetPassword,
      },
    ],
  },
  {
    layout: DashboardLayout,
    children: [
      {
        path: "/dashboard/housekeeper",
        component: HousekeeperDashboard,
        allowedRoles: ["Housekeeper"]
      },
      {
        path: "/dashboard/housekeeper/add-service",
        component: HousekeeperAddService,
        allowedRoles: ["Housekeeper"]
      },
      {
        path: "/dashboard/housekeeper/my-service",
        component: HousekeeperMyService,
        allowedRoles: ["Housekeeper"]
      },
      {
        path: "/dashboard/housekeeper/booking-list",
        component: HouseKeeperBookingList,
        allowedRoles: ["Housekeeper"]
      },
      {
        path: "/dashboard/housekeeper/wallet",
        component: HousekeeperWallet,
        allowedRoles: ["Housekeeper"]
      },
      {
        path: "/dashboard/housekeeper/earning",
        component: HousekeeperEarning,
        allowedRoles: ["Housekeeper"]
      },
      {
        path: "/dashboard/staff",
        component: DashboardStaff,
        allowedRoles: ["Staff"]
      },
      {
        path: "/dashboard/staff/requests",
        component: StaffRequestsPage,
        allowedRoles: ["Staff"]
      },
      {
        path: "/request/:id",
        component: RequestDetailPage,
        allowedRoles: ['Staff']
      },
    ]
  }
];

export default routes;
