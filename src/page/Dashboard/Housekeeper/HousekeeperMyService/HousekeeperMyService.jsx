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
import MyServiceCard from "./MyServiceCard";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: 1,
    title: "Electric Panel Repairing Service",
    location: "Vancouver, Washington",
    category: "Appliance",
    price: 45,
    oldPrice: 55,
    image: "/home-cleaning.webp",
    status: "Active",
  },
  {
    id: 2,
    title: "Computer & Server AMC Service",
    location: "Montana, USA",
    category: "Computer",
    price: 150,
    oldPrice: 150,
    image: "/home-cleaning.webp",
    status: "Pending",
  },
  {
    id: 3,
    title: "AC Repair Services",
    location: "Hanover, Maryland",
    category: "Electrical",
    price: 100,
    oldPrice: 120,
    image: "/home-cleaning.webp",
    status: "Expired",
  },
  {
    id: 4,
    title: "Car Wash",
    location: "Los Angeles, USA",
    category: "Car Wash",
    price: 20,
    oldPrice: 25,
    image: "/home-cleaning.webp",
    status: "Active",
  },
  {
    id: 5,
    title: "Painting Service",
    location: "New York, USA",
    category: "Appliance",
    price: 80,
    oldPrice: 100,
    image: "/home-cleaning.webp",
    status: "Pending",
  },
  {
    id: 6,
    title: "Building Construction",
    location: "Texas, USA",
    category: "Construction",
    price: 5000,
    oldPrice: 5500,
    image: "/home-cleaning.webp",
    status: "Expired",
  },
];

export default function MyServices() {
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredServices =
    filter === "All" ? services : services.filter((s) => s.status === filter);

  // Pagination Logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
        {["All", "Active", "Pending", "Expired"].map((status) => (
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
        {paginatedServices.map((service) => (
          <MyServiceCard service={service} key={service.id} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-end">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
