import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetBookingHistoryQuery, useGetBookingDetailQuery } from "@/redux/api/bookingApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function Badge({ children, variant }) {
  const baseClasses = "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold";
  const variants = {
    destructive: "bg-red-500 text-white",
    success: "bg-green-500 text-white",
    outline: "border border-gray-200 text-gray-700",
  };

  return <span className={`${baseClasses} ${variants[variant] || variants.outline}`}>{children}</span>;
}

export function BookingList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const day = selectedDate ? selectedDate.getDate() : null;
  const month = selectedDate ? selectedDate.getMonth() + 1 : null;
  const year = selectedDate ? selectedDate.getFullYear() : null;

  const { data: bookingHistory, isLoading, isError } = useGetBookingHistoryQuery({
    pageIndex: currentPage,
    pageSize: 5,
    status: statusFilter,
    day,
    month,
    year,
  });

  const { data: bookingDetail, isLoading: isDetailLoading } = useGetBookingDetailQuery(selectedBookingId, {
    skip: !selectedBookingId,
  });

  const handleViewDetails = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBookingId(null);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    const dateString = e.target.value; // Format: "YYYY-MM-DD"
    if (dateString) {
      setSelectedDate(new Date(dateString));
    } else {
      setSelectedDate(null); // Clear the date if the input is cleared
    }
    setCurrentPage(1);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching bookings.</div>;

  const bookings = bookingHistory?.data?.items || [];
  const totalPages = bookingHistory?.data?.totalPages || 1;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Booking List</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
          onChange={handleDateChange}
          className="w-[180px]"
          placeholder="Select a date"
        />
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.bookingId} className="overflow-hidden">
            <CardContent className="p-4 flex gap-4 relative">
              <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src="/placeholder.svg"
                  alt={booking.serviceName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-semibold">{booking.serviceName}</h2>
                  <Badge variant={booking.status === "Confirmed" ? "success" : "destructive"}>
                    {booking.status}
                  </Badge>
                </div>

                <div className="grid gap-1 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-500">Booking Date</span>
                    <span className="flex-1">
                      : {new Date(booking.preferDateStart).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-500">Time</span>
                    <span className="flex-1">
                      : {booking.timeStart} - {booking.timeEnd}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-500">Amount</span>
                    <span className="flex-1">: ${booking.totalPrice}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-500">Location</span>
                    <span className="flex-1">: {booking.location}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-500">Note</span>
                    <span className="flex-1">: {booking.note}</span>
                  </div>
                </div>

                <button
                  className="text-blue-500 text-sm mt-2 hover:text-blue-600 inline-flex items-center gap-1"
                  onClick={() => handleViewDetails(booking.bookingId)}
                >
                  <span className="text-lg">🔍</span> View Details
                </button>
              </div>

              {booking.status === "Confirmed" ? (
                <Button variant="success" className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">
                  Order Complete
                </Button>
              ) : (
                <Button variant="destructive" className="absolute top-4 right-4">
                  Cancel
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          &lt; Prev
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? "default" : "outline"}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next &gt;
        </Button>
      </div>

      {/* Popup for Booking Details */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {isDetailLoading ? (
            <div>Loading details...</div>
          ) : (
            bookingDetail?.data && (
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Service Name:</span> {bookingDetail.data.serviceName}
                </div>
                <div>
                  <span className="font-semibold">Booking Date:</span>{" "}
                  {new Date(bookingDetail.data.preferDateStart).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div>
                  <span className="font-semibold">Time:</span> {bookingDetail.data.timeStart} - {bookingDetail.data.timeEnd}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {bookingDetail.data.status}
                </div>
                <div>
                  <span className="font-semibold">Total Price:</span> ${bookingDetail.data.totalPrice}
                </div>
                <div>
                  <span className="font-semibold">Location:</span> {bookingDetail.data.location}
                </div>
                <div>
                  <span className="font-semibold">Note:</span> {bookingDetail.data.note}
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}