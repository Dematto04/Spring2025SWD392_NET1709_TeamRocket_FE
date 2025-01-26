import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Footer from "./Footer";
import { Button } from "../ui/button";

const MainLayout = () => {
  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <div className="flex items-center gap-8 p-3 justify-between">
            <SidebarTrigger />
            <div className="w-40">
              <img src="/public/logo.png" className="w-full block md:hidden" />
            </div>
            <div className="block md:hidden">
              <Button>Login</Button>
            </div>
          </div>
          <Outlet />
          <footer>Main Footer</footer>
        </main>
      </SidebarProvider>
      <Footer/>
    </>
  );
};

export default MainLayout;
