import React, { useEffect } from 'react';
import { useGetPendingRequestPagingQuery } from '@/redux/api/requestApi';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, MapPin, Clock, DollarSign, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

function RequestPendingService({ onCountUpdate }) {
  const [page, setPage] = React.useState(1);
  const pageSize = 5;

  const {
    data: pendingRequests,
    isLoading,
    isFetching,
  } = useGetPendingRequestPagingQuery({
    pageIndex: page,
    pageSize: pageSize,
  });

  // Update the count in the parent component when data is loaded
  useEffect(() => {
    if (pendingRequests?.data?.pending_creating_requests) {
      const totalCount = pendingRequests.data.total_count || 0;
      if (onCountUpdate) {
        onCountUpdate(totalCount);
      }
    }
  }, [pendingRequests, onCountUpdate]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (!pendingRequests?.data?.total_page || pendingRequests.data.total_page <= 1) return null;

    const totalPages = pendingRequests.data.total_page;
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
        {Array(3).fill(0).map((_, i) => (
          <RequestSkeleton key={i} />
        ))}
      </div>
    );
  }

  const pendingRequestsList = pendingRequests?.data?.pending_creating_requests || [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Pending Service Requests</CardTitle>
          <CardDescription>
            Review and approve pending service requests from housekeepers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingRequestsList.length === 0 ? (
              <Card className="p-6 text-center">
                <p>No pending service requests found</p>
              </Card>
            ) : (
              pendingRequestsList.map((request) => (
                <Card key={request.service_id} className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="h-24 w-24 rounded-md flex-shrink-0 overflow-hidden">
                      <img 
                        src={request.serviceImages?.[0]?.link || request.category_picture_url || 'https://via.placeholder.com/100?text=No+Image'} 
                        alt={request.service_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{request.service_name}</h3>
                          <div className="flex items-center mt-1 space-x-3 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Badge variant="outline">{request.category_name}</Badge>
                            </span>
                            <span className="flex items-center">
                              ${request.service_price}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {request.duration} hour
                            </span>
                          </div>
                          <div className="flex flex-wrap mt-2 gap-x-3 gap-y-1 text-sm">
                            <span className="flex items-center text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              {request.service_district}, {request.service_city}
                            </span>
                            <span className="flex items-center text-muted-foreground">
                              <User className="h-3.5 w-3.5 mr-1" />
                              {request.user_name}
                            </span>
                            <span className="flex items-center text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {new Date(request.created_time).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={request.service_status === "Pending" ? "secondary" : "default"} 
                                className={request.service_status === "Pending" ? "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300" : ""}>
                            {request.service_status}
                          </Badge>
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/request/${request.service_id}`}>
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
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

export default RequestPendingService;
