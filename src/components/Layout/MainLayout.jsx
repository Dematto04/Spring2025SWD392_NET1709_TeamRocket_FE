import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Footer from "./Footer";
import { Button } from "../ui/button";
import Logo from "../Logo";

const MainLayout = () => {
  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <div className="flex items-center gap-8 p-3 justify-between md:hidden fixed z-10 bg-background w-full">
            <SidebarTrigger />
            <Logo className='block md:hidden'/>
            <div className="block md:hidden">
              <Button>Login</Button>
            </div>
          </div>
          <Outlet />
        </main>
      </SidebarProvider>
      <Footer/>
    </>
  );
};

export default MainLayout;
