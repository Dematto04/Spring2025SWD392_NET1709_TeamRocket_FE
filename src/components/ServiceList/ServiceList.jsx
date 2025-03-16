import React, { useState } from "react";
import ServiceItem from "./ServiceItem";
import { useSearchParams } from "react-router-dom";
import { useGetServicesQuery } from "@/redux/api/serviceApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const ServiceItemSkeleton = () => (
  <div className="rounded-lg overflow-hidden shadow-md">
    <Card className="h-full">
      <CardHeader className="p-0 relative w-full">
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="absolute top-2 left-2 h-6 w-24" />
      </CardHeader>
      <CardContent className="md:p-3 xl:px-6 text-xl font-medium space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
      <CardFooter className="md:p-3 xl:p-6">
        <div className="flex w-full justify-between items-center">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardFooter>
    </Card>
  </div>
);

const ServiceListSkeleton = () => (
  <div>
    {/* Header Skeleton */}
    <div className="flex justify-between items-center p-4 w-full">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-[180px]" />
    </div>
    {/* Service List Grid Skeleton */}
    <div className="w-full grid md:grid-cols-2 xl:grid-cols-3 gap-y-6 gap-x-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <ServiceItemSkeleton key={item} />
      ))}
    </div>
    {/* Pagination Skeleton */}
    <div className="flex justify-center mt-8">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-10 w-10" />
        ))}
      </div>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {startPage > 1 && (
        <>
          <Button
            variant={currentPage === 1 ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {startPage > 2 && <span className="mx-1">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="mx-1">...</span>}
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

function ServiceList({ filter }) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess, isFetching } = useGetServicesQuery({
    pageIndex: currentPage,
    pageSize: 9,
    ...filter,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  if (isLoading || isFetching) return <ServiceListSkeleton />;

  const totalPages = Math.ceil((data?.data?.totalCount || 0) / 9);

  return (
    isSuccess && (
      <div className="">
        {/* header */}
        <div className="flex justify-between items-center p-4 w-full">
          <div className="text-xl font-bold">
            Found <span className="text-primary">{data?.data?.totalCount || 0} Services</span>
          </div>
        </div>
        {/* service list */}
        <div className="w-full grid md:grid-cols-2 xl:grid-cols-3 gap-y-6 gap-x-3">
          {/* service items */}
          {data?.data?.items.map((item, idx) => (
            <ServiceItem key={idx} service={item} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    )
  );
}

export default ServiceList;
