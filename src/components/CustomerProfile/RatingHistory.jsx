import React, { useState } from 'react';
import { format } from 'date-fns';
import { useGetCustomerRatingsQuery } from '@/redux/api/ratingApi';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { StarDisplay } from '../Rating/StarDisplay';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RatingHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data: ratingData, isLoading } = useGetCustomerRatingsQuery({
    pageIndex: currentPage,
    pageSize
  });

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Reviews</CardTitle>
          <CardDescription>
            Your rating average: {ratingData?.data?.["rating-average"] || 0} / 5
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Ratings List */}
            {ratingData?.data?.ratings.map((rating, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Avatar Section */}
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={rating["customer-avatar"]} 
                    alt={rating["customer-name"]} 
                  />
                  <AvatarFallback>
                    {rating["customer-name"]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm">
                        {rating["service-name"]}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <StarDisplay rating={rating.rating} />
                        <span className="text-sm text-muted-foreground">
                          {rating.rating}/5
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(rating["rating-date"])}
                    </span>
                  </div>
                  
                  {/* Review Text */}
                  <p className="mt-2 text-sm text-muted-foreground">
                    {rating.review}
                  </p>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {ratingData?.data?.["total-page"] > 1 && (
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={!ratingData.data["has-previous"]}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {ratingData.data["total-page"]}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!ratingData.data["has-next"]}
                >
                  Next
                </Button>
              </div>
            )}

            {/* Empty State */}
            {ratingData?.data?.ratings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  You haven't written any reviews yet.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default RatingHistory;
