import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGetRegisterRequestQuery } from "@/redux/api/requestApi";
import { useGetCategoriesQuery } from "@/redux/api/serviceApi";
import EmptyData from "@/components/EmptyData";
import MobileView from "@/components/RegisterRequest/MobileView";
import LoadingSkeleton from "@/components/RegisterRequest/LoadingSkeleton";
import DesktopView from "@/components/RegisterRequest/DesktopView";

function RegisterApprovePage() {
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const {
    data: registrationData,
    isLoading,
    isSuccess,
    isFetching,
  } = useGetRegisterRequestQuery({
    pageIndex,
    pageSize,
  });

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isSuccess: isCategoriesSuccess,
  } = useGetCategoriesQuery();

  const handlePageChange = (newPage) => {
    setPageIndex(newPage);
  };

  if (isLoading || isCategoriesLoading || isFetching) {
    return <LoadingSkeleton />;
  }

  const registrations = registrationData?.data?.registration_requests || [];
  const totalPages = registrationData?.data?.total_page || 1;

  return (
    isSuccess &&
    isCategoriesSuccess && (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Housekeeper Registration Requests
          </h1>
          <div className="flex gap-2">
            
          </div>
        </div>

        {registrations.length > 0 ? (
          <>
            {" "}
            {/* Mobile View */}
            <MobileView registrations={registrations} categoriesData={categoriesData} />
            {/* Desktop View */}
            <DesktopView registrations={registrations} categoriesData={categoriesData} />
            {/* Pagination */}
            <div className="flex items-center justify-end mt-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pageIndex - 1)}
                  disabled={pageIndex === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={page === pageIndex ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pageIndex + 1)}
                  disabled={pageIndex === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyData />
        )}
      </Card>
    )
  );
}

export default RegisterApprovePage;
