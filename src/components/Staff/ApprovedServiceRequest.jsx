import React, { useEffect, useState } from "react";
import { useGetStaffApprovedRequestPagingQuery } from "@/redux/api/requestApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  User,
  CheckCircle2,
  Search,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ApprovedServiceRequest({ onCountUpdate }) {
  const [page, setPage] = useState(1);
  const [searchByName, setSearchByName] = useState("");
  const [status, setStatus] = useState("Active");
  const [searchInput, setSearchInput] = useState("");
  const pageSize = 5;

  const {
    data: approvedRequests,
    isLoading,
    isFetching,
  } = useGetStaffApprovedRequestPagingQuery({
    pageIndex: page,
    pageSize: pageSize,
    status: status,
    searchByName: searchByName,
  });

  // Update the count in the parent component when data is loaded
  useEffect(() => {
    if (approvedRequests?.data?.approval_services) {
      const totalCount = approvedRequests.data.total_count || 0;
      if (onCountUpdate) {
        onCountUpdate(totalCount);
      }
    }
  }, [approvedRequests, onCountUpdate]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchByName(searchInput);
    setPage(1);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus === "All" ? "" : newStatus);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchByName("");
    setPage(1);
  };

  // Loading skeleton component
  const RequestSkeleton = () => (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-5 w-48" />
              <div className="flex items-center mt-2 space-x-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </Card>
  );

  // Pagination component
  const PaginationComponent = () => {
    if (
      !approvedRequests?.data?.total_page ||
      approvedRequests.data.total_page <= 1
    )
      return null;

    const totalPages = approvedRequests.data.total_page;
    let pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, page - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page if needed
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
              color: page === i ? "#fff" : "inherit",
              cursor: "pointer",
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add last page if needed
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
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.5 : 1,
              }}
            />
          </PaginationItem>
          {pages}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              style={{
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.5 : 1,
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  if (isLoading || isFetching) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Approved Service Requests</CardTitle>
            <CardDescription>Loading service requests...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-10 w-40" />
            </div>
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <RequestSkeleton key={i} />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const approvedServicesList = approvedRequests?.data?.approval_services || [];
  const totalResults = approvedRequests?.data?.total_count || 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Approved Service Requests</CardTitle>
          <CardDescription>
            View all approved service requests from housekeepers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by service or housekeeper name"
                    className="pl-8 pr-10"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button type="submit" variant="secondary" className="ml-2">
                  Search
                </Button>
              </form>
            </div>
            <div className="w-full md:w-auto">
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"All"}>All Statuses</SelectItem>{" "}
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            Found {totalResults} results{" "}
            {searchByName && `for "${searchByName}"`}{" "}
            {status && `with status "${status}"`}
          </div>

          <div className="space-y-4">
            {approvedServicesList.length === 0 ? (
              <Card className="p-6 text-center">
                <p>No service requests found matching your criteria</p>
              </Card>
            ) : (
              approvedServicesList.map((service) => (
                <Card key={service.service_id} className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="h-24 w-24 rounded-md flex-shrink-0 overflow-hidden">
                      <img
                        src={
                          service.serviceImages?.[0]?.link ||
                          service.category_picture_url ||
                          "https://via.placeholder.com/100?text=No+Image"
                        }
                        alt={service.service_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {service.service_name}
                          </h3>
                          <div className="flex items-center mt-1 space-x-3 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Badge variant="outline">
                                {service.category_name}
                              </Badge>
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-3.5 w-3.5 mr-1" />$
                              {service.service_price}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {service.duration}{" "}
                              {service.duration === 1 ? "hour" : "hours"}
                            </span>
                          </div>
                          <div className="flex flex-wrap mt-2 gap-x-3 gap-y-1 text-sm">
                            <span className="flex items-center text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              {service.service_district}, {service.service_city}
                            </span>
                            <span className="flex items-center text-muted-foreground">
                              <User className="h-3.5 w-3.5 mr-1" />
                              {service.user_name}
                            </span>
                            <span className="flex items-center text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {new Date(
                                service.created_time
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant="secondary"
                            className={
                              service.service_status === "Active"
                                ? "bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
                                : "bg-red-100 hover:bg-red-200 text-red-800 border-red-300"
                            }
                          >
                            {service.service_status === "Active" ? (
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 mr-1" />
                            )}
                            {service.service_status}
                          </Badge>
                          <Button asChild variant="outline" size="sm">
                            <Link
                              to={`/request/${service.service_id}`}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                      {service.additionalServices &&
                        service.additionalServices.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-muted-foreground">
                              Additional services:{" "}
                              {service.additionalServices.length}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <PaginationComponent />
    </div>
  );
}

export default ApprovedServiceRequest;
