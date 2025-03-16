import React, { useState } from "react";
import { useGetMyServicesQuery } from "@/redux/api/serviceApi";
import MyServiceCard from "@/components/Housekeeper/MyServiceCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyData from "@/components/EmptyData";

const statusOptions = [
  { label: "All Services", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Pending", value: "Pending" },
  { label: "Rejected", value: "Rejected" },
];

function HousekeeperMyService() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const pageSize = 4;

  const {
    data: services,
    isLoading,
    error,
    isFetching,
    isSuccess,
  } = useGetMyServicesQuery({
    pageIndex: page,
    pageSize: pageSize,
    status: status,
  });

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ServiceCardSkeleton = () => (
    <div className="w-full p-6 rounded-lg border">
      <div className="space-y-3">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <div className="h-48 w-full mb-4">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Skeleton className="h-9 w-[100px]" />
        <Skeleton className="h-9 w-[100px]" />
      </div>
    </div>
  );

  const renderPagination = () => {
    if (!isSuccess || !services?.data?.total_page) return null;

    const totalPages = services.data.total_page;
    if (totalPages <= 1) return null;

    let pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, page - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page
    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="ellipsis1" className="flex items-center">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
    }

    // Add pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={page === i}
            style={{
              backgroundColor: page === i ? "#2563EB" : "transparent",
              color: page === i ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="ellipsis2" className="flex items-center">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              style={{
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            />
          </PaginationItem>
          {pages}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              style={{
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">My Services</h1>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button asChild>
          <Link to="/dashboard/housekeeper/add-service">
            <Plus className="w-4 h-4 mr-2" />
            Add New Service
          </Link>
        </Button>
      </div>

      <div
        className={
          services?.data?.service_details &&
          services?.data?.service_details.length > 0
            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
            : "grid grid-cols-1 "
        }
      >
        {isLoading || isFetching ? (
          Array(6)
            .fill(0)
            .map((_, index) => <ServiceCardSkeleton key={index} />)
        ) : isSuccess &&
          services?.data?.service_details &&
          services?.data?.service_details.length > 0 ? (
          services?.data?.service_details.map((service) => (
            <MyServiceCard key={service.service_id} service={service} />
          ))
        ) : (
          <EmptyData
            title="No service found"
            description="There is no service with this status"
          />
        )}
      </div>
      {renderPagination()}
    </div>
  );
}

export default HousekeeperMyService;
