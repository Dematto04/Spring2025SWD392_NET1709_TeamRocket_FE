import React, { useState } from 'react';
import { format } from 'date-fns';
import { useGetServiceRatingsQuery, useGetFilteredServiceRatingsQuery } from '@/redux/api/ratingApi';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { StarDisplay } from '../Rating/StarDisplay';
import { Star } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

export default function ServiceDetailRating({ serviceId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState("all");
  const pageSize = 5;

  // Use filtered query when rating is selected, otherwise use general query
  const { data: ratingData, isLoading } = selectedRating !== "all"
    ? useGetFilteredServiceRatingsQuery({
        serviceId,
        rate: Number(selectedRating),
        pageIndex: currentPage,
        pageSize
      })
    : useGetServiceRatingsQuery({
        serviceId,
        pageIndex: currentPage,
        pageSize
      });

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  // Calculate rating distribution
  const getRatingDistribution = () => {
    if (!ratingData?.data?.ratings) return [];
    const total = ratingData.data["total-count"];
    return [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: ratingData.data.ratings.filter(r => r.rating === rating).length,
      percentage: (ratingData.data.ratings.filter(r => r.rating === rating).length / total) * 100
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader className="border-b">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Rating Summary */}
          <div className="space-y-4">
            <CardTitle className="text-2xl font-bold">Customer Reviews</CardTitle>
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold">
                  {ratingData?.data?.["rating-average"]?.toFixed(1) || 0}
                </span>
                <div>
                  <StarDisplay rating={ratingData?.data?.["rating-average"] || 0} />
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on {ratingData?.data?.["total-count"] || 0} reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {getRatingDistribution().map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="w-12 text-sm font-medium">
                    {rating} <Star className="w-4 h-4 inline-block" />
                  </div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        rating >= 4 ? "bg-green-500" :
                        rating === 3 ? "bg-yellow-500" :
                        "bg-red-500"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-16 text-sm text-muted-foreground">
                    ({count})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Section */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <Select
              value={selectedRating}
              onValueChange={(value) => {
                setSelectedRating(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ratings</SelectItem>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{rating}</span>
                      <StarDisplay rating={rating} />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Reviews List */}
          {ratingData?.data?.ratings.map((rating, index) => (
            <div
              key={index}
              className="group relative flex flex-col md:flex-row gap-4 p-6 rounded-xl border hover:border-primary transition-all duration-300 hover:shadow-md"
            >
              {/* User Info Section */}
              <div className="flex md:flex-col items-center md:items-start gap-4 md:w-48">
                <Avatar className="h-12 w-12 md:h-16 md:w-16 ring-2 ring-offset-2 ring-primary/10">
                  <AvatarImage 
                    src={rating["customer-avatar"]} 
                    alt={rating["customer-name"]} 
                  />
                  <AvatarFallback className="text-lg">
                    {rating["customer-name"]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">
                    {rating["customer-name"]}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(rating["rating-date"])}
                  </p>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <StarDisplay rating={rating.rating} />
                  <span className={cn(
                    "text-sm font-medium px-2 py-1 rounded-full",
                    rating.rating >= 4 ? "bg-green-100 text-green-700" :
                    rating.rating === 3 ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {rating.rating}/5
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {rating.review}
                </p>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {ratingData?.data?.ratings.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="max-w-md mx-auto">
                <Star className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No reviews found {selectedRating !== "all" ? `with ${selectedRating} stars` : ''}.
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {ratingData?.data?.["total-page"] > 1 && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={!ratingData.data["has-previous"]}
                className="transition-all duration-200 hover:border-primary"
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {ratingData.data["total-page"]}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!ratingData.data["has-next"]}
                className="transition-all duration-200 hover:border-primary"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}