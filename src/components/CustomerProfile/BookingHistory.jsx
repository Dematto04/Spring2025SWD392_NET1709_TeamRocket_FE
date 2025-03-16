import React, { useState } from 'react';
import { format } from 'date-fns';
import { useGetBookingHistoryQuery, useGetBookingDetailQuery, useCancelBookingMutation, useSendRefundRequestMutation } from '@/redux/api/bookingApi';
import { useCreateRatingMutation } from '@/redux/api/ratingApi';
import { Button } from '../ui/button';
import { 
  Star,
  Clock,
  MapPin,
  Calendar,
  MessageSquare,
  Timer,
  ChevronLeft,
  ChevronRight,
  User,
  CreditCard,
  CheckCircle2,
  XCircle,
  Info,
  Clock4,
  Plus,
  DollarSign,
  Calendar as CalendarIcon,
  Search,
  RefreshCcw
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "../ui/textarea";
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as UiCalendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import DragAndDropUpload from '@/components/DragAndDropUpload';

function Badge({ children, variant }) {
  const baseClasses = "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold";
  const variants = {
    ongoing: "bg-yellow-500 text-white",
    finished: "bg-green-500 text-white",
    canceled: "bg-red-500 text-white",
    refunded: "bg-purple-500 text-white",
    confirmed: "bg-blue-500 text-white",
    outline: "border border-gray-200 text-gray-700",
  };

  return <span className={`${baseClasses} ${variants[variant] || variants.outline}`}>{children}</span>;
}

export default function BookingHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [refundBookingId, setRefundBookingId] = useState(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [proofOfPaymentFiles, setProofOfPaymentFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const pageSize = 5;

  const getQueryParams = () => {
    const params = {
    pageIndex: currentPage,
      pageSize: pageSize,
    };

    if (selectedStatus !== "all") {
      params.status = selectedStatus;
    }

    if (selectedDate) {
      const date = new Date(selectedDate);
      params.day = date.getDate();
      params.month = date.getMonth() + 1;
      params.year = date.getFullYear();
    }

    return params;
  };

  const { data: bookingHistory, isLoading } = useGetBookingHistoryQuery(getQueryParams());

  const [createRating, { isLoading: isRatingLoading }] = useCreateRatingMutation();

  const { data: bookingDetail, isLoading: isLoadingDetail } = useGetBookingDetailQuery(
    selectedBookingId,
    { skip: !selectedBookingId }
  );

  const [cancelBooking, { isLoading: isCanceling }] = useCancelBookingMutation();

  const [sendRefundRequest, { isLoading: isRefunding }] = useSendRefundRequestMutation();

  const handleRatingClick = (booking) => {
    setSelectedBooking(booking);
    setRating(5);
    setReview('');
    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = async () => {
    try {
      await createRating({
        rating,
        review,
        "cleaning-service-id": selectedBooking.cleaningServiceId,
        "booking-id": selectedBooking.bookingId
      }).unwrap();

      toast({
        title: "Success",
        description: "Thank you for your rating!",
      });
      setIsRatingModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'OnGoing':
        return 'bg-blue-100 text-blue-800';
      case 'Canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleBookingClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsDetailModalOpen(true);
  };

  const handleCancelBooking = async () => {
    if (!cancelBookingId) return;
    
    try {
      await cancelBooking(cancelBookingId).unwrap();
      
      toast({
        title: "Booking Canceled",
        description: "Your booking has been successfully canceled.",
      });
      
      setIsCancelModalOpen(false);
      setCancelBookingId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to cancel booking. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const openCancelModal = (e, bookingId) => {
    e.stopPropagation();
    setCancelBookingId(bookingId);
    setIsCancelModalOpen(true);
  };

  const handleRefundRequest = async () => {
    if (!refundBookingId || !refundReason || proofOfPaymentFiles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide all required information for the refund request.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await sendRefundRequest({
        bookingId: refundBookingId,
        proofOfPayment: proofOfPaymentFiles[0],
        reason: refundReason
      }).unwrap();
      
      toast({
        title: "Refund Requested",
        description: "Your refund request has been submitted successfully.",
      });
      
      setIsRefundModalOpen(false);
      setRefundBookingId(null);
      setRefundReason('');
      setProofOfPaymentFiles([]);
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to submit refund request. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const openRefundModal = (e, bookingId) => {
    e.stopPropagation();
    setRefundBookingId(bookingId);
    setRefundReason('');
    setProofOfPaymentFiles([]);
    setIsRefundModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setProofOfPaymentFiles([URL.createObjectURL(file)]);
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
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        getStatusColor(detail.status)
                      )}>
                        {detail.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">
                            {format(new Date(detail.preferDateStart), 'MMMM d, yyyy')}
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
                        {detail.paymentStatus === 'succeed' ? (
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
                            {format(new Date(detail.paymentDate), 'MMM d, yyyy HH:mm')}
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
                            <span className="text-muted-foreground">Name:</span>{' '}
                            {detail.housekeeperName}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Email:</span>{' '}
                            {detail.houseKeeperMail}
                          </p>
                          {detail.houseKeeperPhoneNumber && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Phone:</span>{' '}
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
                            <span className="text-muted-foreground">Name:</span>{' '}
                            {detail.customerName}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Email:</span>{' '}
                            {detail.customerMail}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Phone:</span>{' '}
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

  // Status options
  const STATUS_OPTIONS = [
    { value: "all", label: "All Status" },
    { value: "Recently", label: "Recently" },
    { value: "Completed", label: "Completed" },
    { value: "OnGoing", label: "On Going" },
    { value: "Canceled", label: "Canceled" },
    { value: "Refunded", label: "Refunded" },
    { value: "OnRefunding", label: "On Refunding" },
    { value: "RefundRejected", label: "Refund Rejected" },
  ];

  // Handle filter changes
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setSelectedStatus("all");
    setSelectedDate(null);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Booking History</CardTitle>
              <CardDescription>
                View and manage your service bookings
              </CardDescription>
            </div>
            
            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Status Filter */}
              <Select
                value={selectedStatus}
                onValueChange={handleStatusChange}
              >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
          </SelectContent>
        </Select>

              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[180px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      "Pick a date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <UiCalendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Clear Filters Button */}
              {(selectedStatus !== "all" || selectedDate) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="px-3"
                >
                  Clear Filters
                </Button>
              )}
            </div>
      </div>

          {/* Active Filters Display */}
          {(selectedStatus !== "all" || selectedDate) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedStatus !== "all" && (
                <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  <span>Status: {selectedStatus}</span>
                  <button
                    onClick={() => setSelectedStatus("all")}
                    className="hover:text-primary/70"
                  >
                    ×
                  </button>
                </div>
              )}
              {selectedDate && (
                <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  <span>Date: {format(selectedDate, "MMM d, yyyy")}</span>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="hover:text-primary/70"
                  >
                    ×
                  </button>
                </div>
              )}
              </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : bookingHistory?.data?.items.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                No bookings found
                {selectedStatus !== "all" && ` with status "${selectedStatus}"`}
                {selectedDate && ` on ${format(selectedDate, "MMMM d, yyyy")}`}
              </div>
            </div>
          ) : (
            // Bookings List
            <AnimatePresence mode="popLayout">
              <div className="grid gap-6">
                {bookingHistory?.data?.items.map((booking) => (
                  <motion.div
                    key={booking.bookingId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="group"
                  >
                    <Card 
                      className="overflow-hidden transition-all duration-300 hover:shadow-xl border-2 hover:border-primary/20 cursor-pointer"
                      onClick={() => handleBookingClick(booking.bookingId)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Service Info */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                                {booking.serviceName}
                              </h3>
                              <span className={cn(
                                "px-4 py-1 rounded-full text-sm font-medium transition-all",
                                getStatusColor(booking.status)
                              )}>
                    {booking.status}
                    </span>
                  </div>

                            {/* Booking Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(new Date(booking.preferDateStart), 'MMMM d, yyyy')}
                    </span>
                  </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{booking.timeStart} - {booking.timeEnd}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Timer className="w-4 h-4" />
                                <span>{booking.cleaningServiceDuration} hour(s)</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MessageSquare className="w-4 h-4" />
                                <span>{booking.note || 'No notes'}</span>
                  </div>
                  </div>

                            {/* Location */}
                            <div className="flex items-start gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                              <span className="text-sm">{booking.location}</span>
                  </div>
                </div>

                          {/* Price and Actions */}
                          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 pt-4 lg:pt-0 border-t lg:border-t-0">
                            <div className="text-2xl font-bold text-primary">
                              {formatPrice(booking.totalPrice)}
              </div>
                            <div className="flex flex-col gap-2">
                              {booking.status === 'Completed' && !booking.isRating && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRatingClick(booking);
                                  }}
                                  className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  <Star className="w-4 h-4 mr-2" />
                                  Rate Service
                                </Button>
                              )}
                              
                              {booking.status === 'OnGoing' && booking.isCancelable && (
                  <Button
                                  onClick={(e) => openCancelModal(e, booking.bookingId)}
                    variant="destructive"
                                  className="transition-colors"
                                  size="sm"
                  >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel Booking
                  </Button>
                )}
                              {booking.status === 'Completed' && (
                                <Button
                                  onClick={(e) => openRefundModal(e, booking.bookingId)}
                                  variant="outline"
                                  className="border-purple-500 text-purple-600 hover:bg-purple-50"
                                  size="sm"
                                >
                                  <RefreshCcw className="w-4 h-4 mr-2" />
                                  Request Refund
                                </Button>
                              )}
                            </div>
                          </div>
              </div>
            </CardContent>
          </Card>
                  </motion.div>
        ))}
      </div>
            </AnimatePresence>
          )}

      {/* Pagination */}
          {bookingHistory?.data?.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
        <Button
          variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={!bookingHistory.data.hasPrevious}
                  className="w-10 h-10 rounded-full"
                >
                  <ChevronLeft className="w-4 h-4" />
        </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: bookingHistory.data.totalPages }, (_, i) => (
          <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(i + 1)}
                      className="w-10 h-10 rounded-full"
                    >
                      {i + 1}
          </Button>
        ))}
                </div>
        <Button
          variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!bookingHistory.data.hasNext}
                  className="w-10 h-10 rounded-full"
                >
                  <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Rating Modal */}
      <Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Rate Your Experience</DialogTitle>
            <DialogDescription>
              Share your thoughts about {selectedBooking?.serviceName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
              <div className="space-y-4">
              <label className="block text-sm font-medium">Your Rating</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(value)}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      rating >= value ? "text-yellow-400" : "text-gray-300"
                    )}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </motion.button>
                ))}
                </div>
                </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Your Review</label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell us about your experience..."
                className="min-h-[120px] resize-none"
              />
                </div>
              </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsRatingModalOpen(false)}
              disabled={isRatingLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRating}
              disabled={isRatingLoading}
              className="min-w-[100px]"
            >
              {isRatingLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting
                </span>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Cancel Confirmation Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Canceling a booking may be subject to your service provider's cancellation policy. 
              You may receive a partial refund depending on how close the cancellation is to the scheduled service time.
            </p>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelModalOpen(false);
                setCancelBookingId(null);
              }}
              disabled={isCanceling}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isCanceling}
              className="min-w-[120px]"
            >
              {isCanceling ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Canceling...
                </span>
              ) : (
                "Yes, Cancel"
              )}
            </Button>
                </div>
        </DialogContent>
      </Dialog>

      {/* Add Refund Request Modal with DragAndDropUpload */}
      <Dialog open={isRefundModalOpen} onOpenChange={setIsRefundModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-purple-600">Request Refund</DialogTitle>
            <DialogDescription>
              Please provide the necessary information to process your refund request.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Proof of Payment</label>
              <DragAndDropUpload
                files={proofOfPaymentFiles}
                setFiles={setProofOfPaymentFiles}
                maxFiles={1}
                title="Drag and drop payment proof or click to upload"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Please upload a screenshot or photo of your payment receipt
              </p>
                </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Refund</label>
              <Textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Please explain why you're requesting a refund..."
                className="min-h-[100px] resize-none"
              />
                </div>
            
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Refund requests are subject to review. You will be notified once your request has been processed.
              </p>
                </div>
              </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsRefundModalOpen(false);
                setRefundBookingId(null);
                setRefundReason('');
                setProofOfPaymentFiles([]);
              }}
              disabled={isRefunding}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRefundRequest}
              disabled={isRefunding || !refundReason || proofOfPaymentFiles.length === 0}
              className="bg-purple-600 hover:bg-purple-700 min-w-[120px]"
            >
              {isRefunding ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add the BookingDetailModal component */}
      <BookingDetailModal />
    </div>
  );
}