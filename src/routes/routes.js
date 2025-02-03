import MainLayout from "@/components/Layout/MainLayout";
import SimpleLayout from "@/components/Layout/SimpleLayout";
import HousekeeperRegisterPage from "@/page/HousekeeperRegisterPage";

import LoginPage from "@/page/LoginPage";
import RegisterPage from "@/page/RegisterPage";
import { lazy } from "react";
const HomePage = lazy(() => import("@/page/HomePage"));
const routes = [
  {
    layout: MainLayout,
    children: [
      {
        path: "/",
        component: HomePage,
      },
    ],
  },
  {
    layout: SimpleLayout,
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
    ],
  },
];

export default routes;
