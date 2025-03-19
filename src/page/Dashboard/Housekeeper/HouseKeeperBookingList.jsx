import React, { useState, useRef } from 'react';
import { 
  useGetHousekeeperBookingsQuery, 
  useGetBookingDetailQuery, 
  useSubmitProofMutation 
} from '@/redux/api/bookingApi';
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
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';
import { Loader2, ChevronLeft, ChevronRight, ImageIcon, AlertCircle } from 'lucide-react';
import { CalendarIcon, UserIcon, MapPinIcon, StarIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PhoneIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

function HouseKeeperBookingList() {
  // Hooks
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  // State management
  const [pageIndex, setPageIndex] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [selectedFinishBooking, setSelectedFinishBooking] = useState(null);
  const [proofImages, setProofImages] = useState([]);

  // API queries
  const { 
    data: bookingsResponse, 
    isLoading: isBookingsLoading,
    isFetching: isBookingsFetching 
  } = useGetHousekeeperBookingsQuery({
    page: pageIndex,
    pageSize: ITEMS_PER_PAGE,
    status: statusFilter || undefined
  });

  const {
    data: bookingDetailResponse,
    isLoading: isDetailLoading
  } = useGetBookingDetailQuery(
    selectedBookingId, 
    { skip: !selectedBookingId }
  );

  const [submitProof, { isLoading: isSubmittingProof }] = useSubmitProofMutation();

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
    switch (status.toLowerCase()) {
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

  const handleFinishClick = (e, booking) => {
    e.stopPropagation(); // Prevent card click
    setSelectedFinishBooking(booking);
    setProofImages([]);
    setFinishDialogOpen(true);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Add preview URLs for the images
    const newProofImages = files.map(file => ({
      file,
      title: '',
      preview: URL.createObjectURL(file)
    }));

    setProofImages(prevImages => [...prevImages, ...newProofImages]);
  };

  const handleFinishSubmit = async () => {
    try {
      if (proofImages.length === 0) {
        toast({
          title: "Error",
          description: "Please upload at least one proof image",
          variant: "destructive"
        });
        return;
      }

      // Check if all proof images have titles
      const missingTitles = proofImages.some(proof => !proof.title.trim());
      if (missingTitles) {
        toast({
          title: "Error",
          description: "Please provide a title for each proof image",
          variant: "destructive"
        });
        return;
      }

      // Simulate file upload (in a real app, you'd upload to a server/storage)
      // For this example, we'll use the preview URLs as the "uploaded" image URLs
      const proofs = proofImages.map(proof => ({
        title: proof.title,
        imgUrl: proof.preview // In a real app, this would be the URL returned from your server
      }));

      // Submit the proof
      await submitProof({
        bookingId: selectedFinishBooking.id,
        title: proofs[0].title, // Using the first image title as the main title
        imgUrl: proofs[0].preview // Using the first image URL
      }).unwrap();

      toast({
        title: "Success",
        description: "Booking has been marked as completed",
      });

      // Reset states after successful submission
      setFinishDialogOpen(false);
      setSelectedFinishBooking(null);
      setProofImages([]);
      
      // Refresh booking list
      // The invalidatesTags in the mutation will handle this automatically
    } catch (error) {
      console.error('Error submitting completion proof:', error);
      toast({
        title: "Error",
        description: error.data?.messages?.Booking?.[0] || "Failed to submit proof",
        variant: "destructive"
      });
    }
  };

  const removeProofImage = (index) => {
    const newProofImages = [...proofImages];
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newProofImages[index].preview);
    newProofImages.splice(index, 1);
    setProofImages(newProofImages);
  };

  // Format date and time from ISO string
  const formatDateTime = (dateString, timeString) => {
    try {
      const date = parseISO(dateString);
      return `${format(date, 'dd/MM/yyyy')} ${timeString}`;
    } catch (e) {
      // Handle the case where date might not be a valid ISO string
      return `${dateString?.split('T')[0] || 'N/A'} ${timeString || ''}`;
    }
  };

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

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PP') : 'Pick a date'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Date</DialogTitle>
                </DialogHeader>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
              </DialogContent>
            </Dialog>

            {selectedDate && (
              <Button
                variant="ghost"
                onClick={() => setSelectedDate(null)}
              >
                Clear date
              </Button>
            )}
          </div>

          {/* Booking Cards Grid */}
          {isBookingsLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6 border-2 border-dashed rounded-lg">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No bookings found</h3>
              <p className="text-muted-foreground mt-2">Try changing your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((booking) => (
                <Card 
                  key={booking.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden relative"
                  onClick={() => setSelectedBookingId(booking.id)}
                >
                  {/* Service Image */}
                  <div className="relative h-40 bg-gray-100">
                    <img
                      src={booking.serviceImageUrl || "/placeholder-service.jpg"}
                      alt={booking.serviceName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-service.jpg";
                      }}
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Title and Status */}
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium text-lg">{booking.serviceName}</h3>
                        <Badge 
                          variant={getStatusVariant(booking.status)}
                          className="capitalize"
                        >
                          {booking.status === "OnGoing" ? "Ongoing" : booking.status}
                        </Badge>
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <span className="text-gray-500 min-w-[120px]">Booking Date</span>
                          <span className="text-gray-900">: {formatDateTime(booking.preferDateStart, booking.timeStart)}</span>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-gray-500 min-w-[120px]">Amount</span>
                          <div className="flex gap-2 items-center">
                            <span className="text-gray-900">: ₹{booking.totalPrice}</span>
                            <Badge variant="secondary" className="bg-pink-100 text-pink-700 hover:bg-pink-100">
                              COD
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-gray-500 min-w-[120px]">Location</span>
                          <div className="flex-1 overflow-hidden">
                            <span className="text-gray-900 inline-block">: </span>
                            <div className="inline-block truncate max-w-[calc(100%-10px)]">
                              <span className="text-gray-900">
                                {booking.addressLine1}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-gray-500 min-w-[120px]">User</span>
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

          {/* Booking Detail Dialog */}
          <Dialog open={selectedBookingId !== null} onOpenChange={(open) => !open && setSelectedBookingId(null)}>
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
                    <div className="space-y-3">
                      <h3 className="font-medium border-b pb-2 sticky top-0 bg-white">Service Information</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Service:</div>
                        <div className="text-sm">{bookingDetail.serviceName}</div>
                        
                        <div className="text-sm font-medium">Date:</div>
                        <div className="text-sm">{formatDateTime(bookingDetail.preferDateStart, "")}</div>
                        
                        <div className="text-sm font-medium">Time:</div>
                        <div className="text-sm">{bookingDetail.timeStart} - {bookingDetail.timeEnd}</div>
                        
                        <div className="text-sm font-medium">Status:</div>
                        <div>
                          <Badge variant={getStatusVariant(bookingDetail.status)}>
                            {bookingDetail.status === "OnGoing" ? "Ongoing" : bookingDetail.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info Section */}
                    <div className="space-y-3">
                      <h3 className="font-medium border-b pb-2 sticky top-0 bg-white">Customer Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={bookingDetail.customer?.avatarUrl} />
                            <AvatarFallback className="bg-primary/10">
                              {bookingDetail.customer?.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{bookingDetail.customer?.fullName}</div>
                            <div className="text-sm text-gray-500">{bookingDetail.customer?.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <PhoneIcon className="h-4 w-4 text-gray-500" />
                          <span>{bookingDetail.customer?.phoneNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-3">
                      <h3 className="font-medium border-b pb-2 sticky top-0 bg-white">Location Details</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm font-medium">Address:</div>
                          <div className="text-sm">{bookingDetail.addressLine1}</div>
                          
                          <div className="text-sm font-medium">District:</div>
                          <div className="text-sm">{bookingDetail.district}</div>
                          
                          <div className="text-sm font-medium">City:</div>
                          <div className="text-sm">{bookingDetail.city}</div>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown Section */}
                    <div className="space-y-3">
                      <h3 className="font-medium border-b pb-2 sticky top-0 bg-white">Price Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Service Price</span>
                          <span>₹{bookingDetail.servicePrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Distance Price</span>
                          <span>₹{bookingDetail.distancePrice}</span>
                        </div>
                        
                        {/* Additional Services */}
                        {bookingDetail.additionalPrice > 0 && (
                          <div className="flex justify-between text-gray-600">
                            <span>Additional Services</span>
                            <span>₹{bookingDetail.additionalPrice}</span>
                          </div>
                        )}

                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Total Amount</span>
                          <span>₹{bookingDetail.totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes Section */}
                    {bookingDetail.note && (
                      <div className="space-y-3">
                        <h3 className="font-medium border-b pb-2 sticky top-0 bg-white">Notes</h3>
                        <div className="text-sm bg-gray-50 p-3 rounded-md">
                          {bookingDetail.note}
                        </div>
                      </div>
                    )}

                    {/* Feedback Section */}
                    {bookingDetail.status === "Completed" && (bookingDetail.rating || bookingDetail.feedback) && (
                      <div className="space-y-3">
                        <h3 className="font-medium border-b pb-2 sticky top-0 bg-white">Feedback</h3>
                        <div className="space-y-2">
                          {bookingDetail.rating && (
                            <div className="flex items-center gap-2">
                              <StarIcon className="h-5 w-5 text-yellow-400" />
                              <span className="text-sm">{bookingDetail.rating} / 5</span>
                            </div>
                          )}
                          {bookingDetail.feedback && (
                            <div className="text-sm bg-gray-50 p-3 rounded-md">
                              {bookingDetail.feedback}
                            </div>
                          )}
                        </div>
                      </div>
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

          {/* Finish Booking Dialog */}
          <Dialog open={finishDialogOpen} onOpenChange={(open) => !open && setFinishDialogOpen(false)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Complete Booking</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Proof Images</Label>
                  <div className="grid grid-cols-1 gap-4">
                    {proofImages.map((proof, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`title-${index}`}>Title for Image {index + 1}</Label>
                          <Input
                            id={`title-${index}`}
                            value={proof.title}
                            onChange={(e) => {
                              const newProofs = [...proofImages];
                              newProofs[index].title = e.target.value;
                              setProofImages(newProofs);
                            }}
                            placeholder="Enter a description for this image"
                            maxLength={255}
                          />
                        </div>
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={proof.preview}
                            alt={`Proof ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => removeProofImage(index)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {proofImages.length < 1 && (
                      <div className="space-y-6">
                        <div 
                          className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 text-center">
                            Click to upload an image of your completed work
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Upload a clear image of your completed work as proof
                  </p>
                </div>

                <div className="flex justify-end gap-2">
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
                      isSubmittingProof || 
                      proofImages.length === 0 || 
                      proofImages.some(proof => !proof.title.trim())
                    }
                  >
                    {isSubmittingProof ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Completion'
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
                  disabled={!bookingsResponse?.data?.hasNext || isBookingsFetching}
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