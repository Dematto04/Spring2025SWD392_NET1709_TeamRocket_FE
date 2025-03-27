import React, { useState, useRef, useEffect } from "react";
import {
  useGetHousekeeperBookingsQuery,
  useGetBookingDetailQuery,
  useSubmitProofMutation,
} from "@/redux/api/bookingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  AlertCircle,
  Clock,
  CalendarDays,
  CreditCard,
  MapPin,
  FileText,
  Info,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PhoneIcon, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const ITEMS_PER_PAGE = 12;
const PLACEHOLDER_IMAGE = "/placeholder-service.jpg";

function HouseKeeperBookingList() {
  // Hooks
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const loadedImages = useRef(new Set());

  // State management
  const [pageIndex, setPageIndex] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [selectedFinishBooking, setSelectedFinishBooking] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [proofTitle, setProofTitle] = useState("");

  // API queries
  const {
    data: bookingsResponse,
    isLoading: isBookingsLoading,
    isFetching: isBookingsFetching,
  } = useGetHousekeeperBookingsQuery({
    page: pageIndex,
    pageSize: ITEMS_PER_PAGE,
    status: statusFilter === "All" ? undefined : statusFilter,
  });

  const { data: bookingDetailResponse, isLoading: isDetailLoading } =
    useGetBookingDetailQuery(selectedBookingId, { skip: !selectedBookingId });

  const [submitProof, { isLoading: isSubmittingProof }] =
    useSubmitProofMutation();

  // Extract data from response
  const bookings = bookingsResponse?.data?.items || [];
  const totalPages = bookingsResponse?.data?.totalPages || 1;
  const bookingDetail = bookingDetailResponse?.data;

  // Pagination handlers
  const handlePreviousPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (bookingsResponse?.data?.hasNext) {
      setPageIndex(pageIndex + 1);
    }
  };

  // Status badge color mapping
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "canceled":
      case "cancelled":
        return "destructive";
      case "ongoing":
        return "purple";
      case "refunded":
        return "blue";
      default:
        return "secondary";
    }
  };

  // Payment status badge color mapping
  const getPaymentStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "succeed":
        return "success";
      case "failed":
        return "destructive";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  const handleFinishClick = (e, booking) => {
    e.stopPropagation(); // Prevent card click
    setSelectedFinishBooking(booking);
    setProofImage(null);
    setProofTitle("");
    setFinishDialogOpen(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create a preview URL for the image
    const preview = URL.createObjectURL(file);
    setProofImage({
      file,
      preview,
    });
  };

  const handleFinishSubmit = async () => {
    try {
      if (!proofImage) {
        toast({
          title: "Error",
          description: "Please upload a proof image",
          variant: "destructive",
        });
        return;
      }

      if (!proofTitle.trim()) {
        toast({
          title: "Error",
          description: "Please provide a title for your proof",
          variant: "destructive",
        });
        return;
      }

      // Submit the proof
      await submitProof({
        bookingId: selectedFinishBooking.id,
        title: proofTitle,
        imgUrl: proofImage.preview, // In a real app, this would be the URL from server upload
      }).unwrap();

      toast({
        title: "Success",
        description: "Booking has been marked as completed",
      });

      // Reset states after successful submission
      setFinishDialogOpen(false);
      setSelectedFinishBooking(null);
      setProofImage(null);
      setProofTitle("");

      // Refresh booking list happens automatically via invalidatesTags
    } catch (error) {
      console.error("Error submitting completion proof:", error);
      toast({
        title: "Error",
        description:
          error.data?.messages?.Booking?.[0] || "Failed to submit proof",
        variant: "destructive",
      });
    }
  };

  const removeProofImage = () => {
    if (proofImage) {
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(proofImage.preview);
      setProofImage(null);
    }
  };

  // Format date and time from ISO string
  const formatDateTime = (dateString, timeString) => {
    try {
      const date = parseISO(dateString);
      return `${format(date, "dd/MM/yyyy")} ${timeString || ""}`;
    } catch (e) {
      // Handle the case where date might not be a valid ISO string
      return `${dateString?.split("T")[0] || "N/A"} ${timeString || ""}`;
    }
  };

  // Format payment date
  const formatPaymentDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy HH:mm");
    } catch (e) {
      return dateString;
    }
  };

  // Helper function to handle image loading/errors
  const handleImageError = (e, id) => {
    if (!loadedImages.current.has(id)) {
      e.target.src = PLACEHOLDER_IMAGE;
      loadedImages.current.add(id);
    }
  };

  // When component unmounts, clear the set
  useEffect(() => {
    return () => {
      loadedImages.current.clear();
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Booking Cards Grid with improved image handling */}
          {isBookingsLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6 border-2 border-dashed rounded-lg">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No bookings found</h3>
              <p className="text-muted-foreground mt-2">
                Try changing your filters or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden relative"
                  onClick={() => setSelectedBookingId(booking.id)}
                >
                  {/* Service Image with improved handling */}
                  <div className="relative h-40 bg-gray-100">
                    {booking.serviceImageUrl ? (
                      <img
                        src={booking.serviceImageUrl}
                        alt={booking.serviceName}
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e, booking.id)}
                        loading="lazy" // Add lazy loading
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Title and Status */}
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium text-lg">
                          {booking.serviceName}
                        </h3>
                        <Badge
                          variant={getStatusVariant(booking.status)}
                          className="capitalize"
                        >
                          {booking.status === "OnGoing"
                            ? "Ongoing"
                            : booking.status}
                        </Badge>
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <span className="text-gray-500 min-w-[120px]">
                            Booking Date
                          </span>
                          <span className="text-gray-900">
                            :{" "}
                            {formatDateTime(
                              booking.preferDateStart,
                              booking.timeStart
                            )}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-gray-500 min-w-[120px]">
                            Amount
                          </span>
                          <div className="flex gap-2 items-center">
                            <span className="text-gray-900">
                              : ${booking.totalPrice}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-gray-500 min-w-[120px]">
                            Location
                          </span>
                          <div className="flex-1 overflow-hidden">
                            <span className="text-gray-900 inline-block">
                              :{" "}
                            </span>
                            <div className="inline-block truncate max-w-[calc(100%-10px)]">
                              <span className="text-gray-900">
                                {booking.addressLine1}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-gray-500 min-w-[120px]">
                            User
                          </span>
                          <div className="flex flex-1 items-center gap-2">
                            <span>:</span>
                            <div className="flex items-center gap-2 min-w-0">
                              <Avatar className="h-6 w-6 flex-shrink-0">
                                <AvatarImage src={booking.customer.avatarUrl} />
                                <AvatarFallback className="bg-primary/10">
                                  {booking.customer.fullName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {booking.customer.fullName}
                                </p>
                                <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                                  <PhoneIcon className="h-3 w-3 flex-shrink-0" />
                                  {booking.customer.phoneNumber}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Add Finish Button for ongoing bookings that are finishable */}
                      {booking.status === "OnGoing" && booking.isFinishable && (
                        <div className="mt-4">
                          <Button
                            className="w-full"
                            onClick={(e) => handleFinishClick(e, booking)}
                          >
                            Complete Job
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Updated Booking Detail Dialog */}
          <Dialog
            open={selectedBookingId !== null}
            onOpenChange={(open) => !open && setSelectedBookingId(null)}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-6 -mr-6">
                {isDetailLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : bookingDetail ? (
                  <div className="space-y-6">
                    {/* Service Info Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-lg">
                          {bookingDetail.serviceName}
                        </h3>
                        <Badge
                          variant={getStatusVariant(bookingDetail.status)}
                          className="capitalize"
                        >
                          {bookingDetail.status === "OnGoing"
                            ? "Ongoing"
                            : bookingDetail.status}
                        </Badge>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">
                            {formatDateTime(bookingDetail.preferDateStart, "")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {bookingDetail.timeStart} - {bookingDetail.timeEnd}(
                            {bookingDetail.cleaningServiceDuration}{" "}
                            {bookingDetail.cleaningServiceDuration > 1
                              ? "hours"
                              : "hour"}
                            )
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {bookingDetail.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-medium">Additional Services</h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        {bookingDetail.bookings &&
                        bookingDetail.bookings.length > 0 ? (
                          bookingDetail.bookings.map((additional, index) => (
                            <div
                              key={additional.additionalId}
                              className={`flex items-center justify-between ${
                                index !== bookingDetail.bookings.length - 1
                                  ? "pb-3 border-b border-gray-200"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded overflow-hidden">
                                  <img
                                    src={additional.url}
                                    alt={additional.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    {additional.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {additional.duration} minutes
                                  </p>
                                </div>
                              </div>
                              <div className="text-sm font-semibold">
                                ${additional.price.toFixed(2)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            No additional services booked
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Payment Info Section */}
                    <div className="space-y-3">
                      <h3 className="font-medium">Payment Information</h3>
                      <div className="grid grid-cols-2 gap-y-2">
                        <div className="text-sm text-gray-500">
                          Payment Method:
                        </div>
                        <div className="text-sm font-medium flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5" />
                          {bookingDetail.paymentMethod}
                        </div>

                        <div className="text-sm text-gray-500">
                          Payment Status:
                        </div>
                        <Badge
                          variant={getPaymentStatusVariant(
                            bookingDetail.paymentStatus
                          )}
                          className="w-fit capitalize"
                        >
                          {bookingDetail.paymentStatus}
                        </Badge>

                        <div className="text-sm text-gray-500">
                          Payment Date:
                        </div>
                        <div className="text-sm">
                          {formatPaymentDate(bookingDetail.paymentDate)}
                        </div>

                        <div className="text-sm text-gray-500">
                          Total Amount:
                        </div>
                        <div className="text-sm font-semibold">
                          ${bookingDetail.totalPrice}
                        </div>
                      </div>
                    </div>

                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-medium">Commission</h3>
                      <div className="grid grid-cols-2 gap-y-2">
                        <div className="text-sm text-gray-500">
                          Commision Fee:
                        </div>
                        <div className="text-sm font-medium flex items-center gap-1">
                          {/* <CreditCard className="h-3.5 w-3.5" /> */}$
                          {bookingDetail?.fee}
                        </div>
                      </div>
                    </div>

                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-medium">Commission</h3>
                      <div className="grid grid-cols-2 gap-y-2">
                        <div className="text-sm text-gray-500">
                          Proof image:
                        </div>
                        {bookingDetail?.proof ? (
                          <div className="text-sm font-medium flex items-center gap-1">
                            <img src={bookingDetail?.proof} alt="" />
                          </div>
                        ) : (
                          <div className="text-sm font-medium flex items-center gap-1">
                            No proof uploaded!
                          </div>
                        )}
                      </div>
                    </div>
                    <Separator />
                    {/* Customer Info Section */}
                    <div className="space-y-3">
                      <h3 className="font-medium">Customer Information</h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="font-medium">
                          {bookingDetail.customerName}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{bookingDetail.customerMail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <PhoneIcon className="h-4 w-4 text-gray-500" />
                          <span>{bookingDetail.customerPhoneNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes Section - Only show if notes exist */}
                    {bookingDetail.note && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <h3 className="font-medium">Notes</h3>
                          <div className="flex gap-2 bg-yellow-50 p-3 rounded-md">
                            <FileText className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{bookingDetail.note}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Booking details not available
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Modified Finish Booking Dialog */}
          <Dialog
            open={finishDialogOpen}
            onOpenChange={(open) => !open && setFinishDialogOpen(false)}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Complete Booking</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="proof-title">Proof Title</Label>
                  <Input
                    id="proof-title"
                    value={proofTitle}
                    onChange={(e) => setProofTitle(e.target.value)}
                    placeholder="Enter a descriptive title for your proof"
                    maxLength={255}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Proof Image</Label>

                  {proofImage ? (
                    <div className="relative border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-gray-100">
                        <img
                          src={proofImage.preview}
                          alt="Completion proof"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeProofImage}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center font-medium">
                        Click to upload an image
                      </p>
                      <p className="text-xs text-gray-400 text-center mt-1">
                        Upload a clear photo of your completed work
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  )}

                  <p className="text-sm text-gray-500 mt-2">
                    The image will be reviewed to verify the completion of your
                    work
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setFinishDialogOpen(false)}
                    disabled={isSubmittingProof}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFinishSubmit}
                    disabled={
                      isSubmittingProof || !proofImage || !proofTitle.trim()
                    }
                  >
                    {isSubmittingProof ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Completion"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Pagination */}
          {!isBookingsLoading && bookings.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Page {pageIndex} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={pageIndex === 1 || isBookingsFetching}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={
                    !bookingsResponse?.data?.hasNext || isBookingsFetching
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default HouseKeeperBookingList;
