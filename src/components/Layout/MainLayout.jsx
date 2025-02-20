import { Link, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Footer from "./Footer";
import { Button } from "../ui/button";
import Logo from "../Logo";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import { useGetServicesQuery } from "@/redux/api/serviceApi";

const MainLayout = () => {
  const user = useSelector(selectUser);
  const { data, isLoading } = useGetServicesQuery();
  
  return (
    !isLoading && (
      <>
        <div className="hidden md:block">
          <Navbar services={data.data}/>
        </div>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <div className="flex items-center gap-8 p-3 justify-between md:hidden fixed z-10 bg-background w-full">
              <SidebarTrigger />
              <Logo className="block md:hidden" />
              {!user ? (
                <Link to="/login" className="block md:hidden">
                  <Button>Login</Button>
                </Link>
              ) : (
                <div></div>
              )}
            </div>
            <Outlet context={{services: data.data}}/>
          </main>
        </SidebarProvider>
        <Footer />
      </>
    )
  );
};

export default MainLayout;
