import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { BookText, ChevronDown, Home, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { SidebarUser } from "./SidebarUser";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
export function AppSidebar() {
  const { isMobile, toggleSidebar } = useSidebar();
  const user = useSelector(selectUser);
  return (
    <>
      {isMobile && (
        <>
          <Sidebar side="left">
            <SidebarHeader>
              <div className="flex justify-between items-center">
                <div className="w-40">
                  <img src="/public/logo.png" className="w-full" />
                </div>
                <div>
                  <ThemeToggle />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => toggleSidebar()}
                  >
                    <Menu className="text-primary" />
                  </Button>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent className="mt-8">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link>
                        <Home className="text-primary" />
                        <span className="text-primary">Home</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroup>
                  <SidebarMenuButton asChild>
                    <CollapsibleTrigger>
                      Service
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarMenuButton>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubButton className="flex justify-between">
                          <div>Home Cleaning</div>
                          <Badge className="italic" variant="destructive">
                            Hot
                          </Badge>
                        </SidebarMenuSubButton>
                        <SidebarMenuSubButton className="flex justify-between">
                          <div>Air Conditioner Cleaning</div>
                        </SidebarMenuSubButton>
                        <SidebarMenuSubButton className="flex justify-between">
                          <div>Sofa Cleaning</div>
                        </SidebarMenuSubButton>
                      </SidebarMenuSub>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link>
                      <BookText className="" />
                      <span className="">Blogs</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              {user ? (
                <SidebarUser />
              ) : (
                <>
                  <Button>Login</Button>
                  <Button variant="outline">Register</Button>
                </>
              )}
            </SidebarFooter>
          </Sidebar>
        </>
      )}
    </>
  );
}
