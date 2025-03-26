import React, { useState } from "react";
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
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Hash,
  Info,
  MapPin,
  Clock,
  Timer,
  User,
  CreditCard,
  CheckCircle2,
  DollarSign,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetHousekeeperEarningsQuery } from "@/redux/api/walletApi";
import { useGetBookingDetailQuery } from "@/redux/api/bookingApi"; // Added for booking details
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns"; // Added for date formatting

function HousekeeperEarning() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Build query parameters dynamically
  const getQueryParams = () => {
    const params = {
      pageIndex: page,
      pageSize: pageSize,
    };

    if (selectedDate) {
      const date = new Date(selectedDate);
      params.day = date.getDate();
      params.month = date.getMonth() + 1; // API expects 1-12
      params.year = date.getFullYear();
    }

    return params;
  };

  const queryParams = getQueryParams();

  const { data, isLoading, error } = useGetHousekeeperEarningsQuery(queryParams);
  const { data: bookingDetail, isLoading: isLoadingDetail } = useGetBookingDetailQuery(
    selectedBookingId,
    { skip: !selectedBookingId }
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Status badge styling with Refunded case
  const getStatusBadge = (status) => {
    switch (status) {
      case "Refunded":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" />
            <span>{status}</span>
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            <span>{status}</span>
          </Badge>
        );
    }
  };

  // Get earnings styling based.PosStatus
  const getEarningsStyling = (status) => {
    return status === "Refunded"
      ? { color: "text-red-600", prefix: "-" }
      : { color: "text-green-600", prefix: "" };
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setSelectedDate(value ? new Date(value) : null);
    setPage(1); // Reset to first page when filter changes
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
    setPage(1);
  };

  const handleBookingClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsDetailModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "OnGoing":
        return "bg-blue-100 text-blue-800";
      case "Canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const BookingDetailModal = () => {
    if (!bookingDetail?.data) return null;

    const detail = bookingDetail.data;

    return (
      <Dialog
        open={isDetailModalOpen}
        onOpenChange={(open) => {
          setIsDetailModalOpen(open);
          if (!open) setSelectedBookingId(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {isLoadingDetail ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : bookingDetail?.data ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <Info className="w-6 h-6" />
                  Booking Details
                </DialogTitle>
                <DialogDescription>
                  Booking ID: {bookingDetail.data.bookingId}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                {/* Service Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Service Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">{detail.serviceName}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          detail.status
                        )}`}
                      >
                        {detail.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">
                            {format(new Date(detail.preferDateStart), "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Time</p>
                          <p className="font-medium">
                            {detail.timeStart} - {detail.timeEnd}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">{detail.cleaningServiceDuration} hour(s)</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Additional Services</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {detail.additionalServiceName.length > 0 ? (
                              detail.additionalServiceName.map((service, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                >
                                  {service}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">None</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{detail.location}</p>
                      </div>
                    </div>

                    {detail.note && (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">Note</p>
                          <p className="font-medium">{detail.note}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Payment Method</p>
                          <p className="font-medium">{detail.paymentMethod}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {detail.paymentStatus === "succeed" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">Payment Status</p>
                          <p className="font-medium capitalize">{detail.paymentStatus}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Payment Date</p>
                          <p className="font-medium">
                            {format(new Date(detail.paymentDate), "MMM d, yyyy HH:mm")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="font-medium text-lg text-primary">
                            {formatPrice(detail.totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Housekeeper */}
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Housekeeper
                        </h4>
                        <div className="space-y-2 pl-6">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Name:</span>{" "}
                            {detail.housekeeperName}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Email:</span>{" "}
                            {detail.houseKeeperMail}
                          </p>
                          {detail.houseKeeperPhoneNumber && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Phone:</span>{" "}
                              {detail.houseKeeperPhoneNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Customer */}
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Customer
                        </h4>
                        <div className="space-y-2 pl-6">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Name:</span>{" "}
                            {detail.customerName}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Email:</span>{" "}
                            {detail.customerMail}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Phone:</span>{" "}
                            {detail.customerPhoneNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              No booking details available
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Card className="space-y-6">
      <CardHeader>
        <CardTitle>Housekeeper Earnings</CardTitle>
        <CardDescription>View your earnings history</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Date Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1">
            <Label htmlFor="dateFilter">Filter by Date</Label>
            <Input
              id="dateFilter"
              type="date"
              value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
              onChange={handleDateChange}
              className="mt-1 w-full md:w-64"
            />
          </div>
          {selectedDate && (
            <Button variant="outline" onClick={clearDateFilter}>
              Clear Filter
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            Error loading earnings: {error.message}
          </div>
        ) : !data?.data?.items?.length ? (
          <div className="text-center py-12 text-muted-foreground">
            No earnings found {selectedDate ? "for this date" : ""}
          </div>
        ) : (
          <>
            {/* Earnings Table */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Fee</TableHead>
                    <TableHead className="text-right">Your Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.items.map((earning, index) => {
                    const { color, prefix } = getEarningsStyling(earning.status);
                    return (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {formatDate(earning.date)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(earning.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-sm flex items-center gap-2"
                            onClick={() => handleBookingClick(earning.bookingId)}
                          >
                            <Hash className="h-3 w-3 text-muted-foreground" />
                            {earning.bookingId || "N/A"}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(earning.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(earning.fee)}
                        </TableCell>
                        <TableCell className={`text-right font-bold ${color}`}>
                          {prefix}
                          {formatPrice(earning.yourEarn)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {data.data.totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {(page - 1) * pageSize + 1} to{" "}
                  {Math.min(page * pageSize, data.data.totalCount)} of{" "}
                  {data.data.totalCount}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={!data.data.hasPrevious}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {page} of {data.data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={!data.data.hasNext}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      <BookingDetailModal />
    </Card>
  );
}

export default HousekeeperEarning;