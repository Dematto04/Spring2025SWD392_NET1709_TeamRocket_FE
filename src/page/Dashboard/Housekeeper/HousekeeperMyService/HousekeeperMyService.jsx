import { Edit, EllipsisVertical, PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useGetMyServicesQuery } from "@/redux/api/serviceApi";
import LoadingScreen from "@/components/Loading";


export default function MyServices() {
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const {data: services, isLoading} = useGetMyServicesQuery({
    status: "",
    pageIndex: currentPage,
    pageSize: itemsPerPage,
  });

  if (isLoading) return <LoadingScreen/>;

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <div className="flex justify-between flex-wrap md:flex-nowrap items-center">
        <h1 className="text-2xl font-bold">My Services</h1>
        <button className="hidden md:flex items-center gap-2 mt-4 bg-black text-white px-4 py-2 rounded-lg">
          <PlusCircle /> Add Services
        </button>
        <DropdownMenu className="block md:hidden">
          <DropdownMenuTrigger className="block md:hidden">
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Option</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["All", "Active", "Pending", "Expired"].map((status) => (
              <DropdownMenuItem key={status}>
                <Button
                  onClick={() => {
                    setFilter(status);
                    setCurrentPage(1); // Reset to page 1 on filter change
                  }}
                  className={` ${
                    filter === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-stone-700 text-primary-foreground"
                  }`}
                >
                  {status} Services
                </Button>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Button
                variant="outline"
                className="flex items-center rounded-lg"
              >
                <PlusCircle /> Add Services
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters */}
      <div className="hidden mt-4 md:flex flex-wrap md:flex-nowrap  gap-4">
        {["All", "Active", "Pending", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setCurrentPage(1); // Reset to page 1 on filter change
            }}
            className={`px-4 py-2 border rounded-lg ${
              filter === status
                ? "bg-primary text-primary-foreground"
                : "bg-stone-700 text-primary-foreground"
            }`}
          >
            {status} Services
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="mt-6 grid grid-cols-1  lg:grid-cols-3 gap-6">
        
      </div>

      {/* Pagination Controls */}
      
      
    
    </div>
  );
}
