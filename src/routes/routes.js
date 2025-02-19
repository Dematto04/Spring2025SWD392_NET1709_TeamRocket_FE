import MainLayout from "@/components/Layout/MainLayout";
import SimpleLayout from "@/components/Layout/SimpleLayout";
import ConfirmEmail from "@/page/ConfirmEmail";
import DashboardAdmin from "@/page/Dashboard/DashboardAdmin";
import DashboardStaff from "@/page/Dashboard/DashboardStaff";
import ForgotPassword from "@/page/ForgotPassword";
import HomePage from "@/page/HomePage";
import HousekeeperRegisterPage from "@/page/HousekeeperRegisterPage";

import LoginPage from "@/page/LoginPage";
import RegisterPage from "@/page/RegisterPage";
import ResetPassword from "@/page/ResetPassword";
import ServiceBookPage from "@/page/ServiceBookPage";
import ServiceIntroPage from "@/page/ServiceIntro";
import CustomerProfilePage from "@/page/CustomerProfilePage";

const routes = [
  {
    layout: MainLayout,
    children: [
      {
        path: "/",
        component: HomePage,
      },
      {
        path: "/service/intro/:id",
        component: ServiceIntroPage,
      },
      {
        path: "/service/:id",
        component: ServiceBookPage,
      },
      {
        path: "/profile/customer",
        component: CustomerProfilePage,
        },
        {
        path: "/dashboard/admin",
        component: DashboardAdmin,
        allowedRoles: ['Admin']
      },
      {
        path: "/dashboard/staff",
        component: DashboardStaff,
        allowedRoles: ["Admin", "Staff"]
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
];

export default routes;
