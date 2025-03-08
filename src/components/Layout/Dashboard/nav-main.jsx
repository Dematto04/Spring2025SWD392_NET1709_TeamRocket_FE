import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export function NavMain({ items, clickedItem, setClickedItem }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item, idx) => (
          <Link
            key={item.title}
            to={item.url}
            className="block"
            onClick={() => {
              setClickedItem(item.title);
              localStorage.setItem("dashboard-item", item.title)
            }}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={item.title}
                className={
                  item.title === clickedItem
                    ? "bg-primary font-medium text-primary-foreground hover:bg-primary hover:text-primary-foreground "
                    : ""
                }
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
