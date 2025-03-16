import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useGetBookingsAdminViewQuery } from "@/redux/api/adminApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Star } from "lucide-react";

export function AdminBookings() {
  const { id } = useParams();
  const location = useLocation();
  const { isService, isCategory } = location.state || {};
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data: response, isLoading } = useGetBookingsAdminViewQuery({
    isService,
    isCategory,
    Id: id,
    pageIndex: currentPage,
    pageSize,
    status: "Completed",
    ...(selectedDate && {
      day: selectedDate.getDate(),
      month: selectedDate.getMonth() + 1,
      year: selectedDate.getFullYear(),
    }),
  });

  const bookings = response?.data?.items || [];
  const { totalPages, hasNext, hasPrevious } = response?.data || {};

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Booking History - {bookings[0]?.serviceName}
          </CardTitle>
          
          <div className="flex gap-2 mt-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Filter by date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            {selectedDate && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedDate(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.bookingId}>
                      <TableCell className="font-medium">
                        {booking.bookingId.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.preferDateStart), "PP")}
                      </TableCell>
                      <TableCell>
                        {booking.timeStart} - {booking.timeEnd}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={booking.location}>
                        {booking.location}
                      </TableCell>
                      <TableCell>${booking.totalPrice}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === "Completed" 
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {booking.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {bookings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No bookings found</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => p - 1)}
                      disabled={!hasPrevious}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={!hasNext}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminBookings;