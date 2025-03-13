import React, { useState } from 'react';
import { useGetBookingHistoryQuery, useGetBookingDetailQuery } from '@/redux/api/bookingApi';
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
import { format } from 'date-fns';
import { Loader2, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { CalendarIcon, UserIcon, MapPinIcon, StarIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PhoneIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ITEMS_PER_PAGE = 6;

function HouseKeeperBookingList() {
  // State management
  const [pageIndex, setPageIndex] = useState(1);
  const [status, setStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [selectedFinishBooking, setSelectedFinishBooking] = useState(null);
  const [completionProof, setCompletionProof] = useState({
    proofs: []  // Array of { title: string, imgUrl: string }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Example data structure for bookings
  const mockBookings = {
    data: [
      {
        id: 1,
        preferDateStart: "2025-04-25",
        timeStart: "09:00:00",
        timeEnd: "11:00:00",
        status: "in progress",
        isFinishable: true,
        totalPrice: 75,
        servicePrice: 65,
        distancePrice: 5,
        additionalPrice: 5,
        customerId: "user123",
        customer: {
          fullName: "Demouser",
          email: "demouser@gmail.com",
          phoneNumber: "9941636316"
        },
        cleaningService: {
          name: "Laser tattoo removal",
          description: "Professional laser tattoo removal service"
        },
        addressLine1: "123 Main Street",
        city: "Singapore",
        district: "Central",
        note: "Please arrive on time"
      },
      {
        id: 2,
        preferDateStart: "2025-04-26",
        timeStart: "14:00:00",
        timeEnd: "16:00:00",
        status: "pending",
        totalPrice: 90,
        servicePrice: 80,
        distancePrice: 5,
        additionalPrice: 5,
        customerId: "user124",
        customer: {
          fullName: "John Smith",
          email: "john@gmail.com",
          phoneNumber: "9941636317"
        },
        cleaningService: {
          name: "Deep house cleaning",
          description: "Complete house deep cleaning service"
        },
        addressLine1: "456 Marina Bay Drive",
        city: "Singapore",
        district: "Marina Bay",
        note: "Need extra attention to kitchen area"
      }
    ],
    totalCount: 2,
    isLoading: false
  };

  // Example booking detail data
  const mockBookingDetail = {
    data: {
      id: 1,
      preferDateStart: "2025-04-25",
      timeStart: "09:00:00",
      timeEnd: "11:00:00",
      createdDate: "2024-03-15",
      status: "completed",
      totalPrice: 75,
      servicePrice: 65,
      distancePrice: 5,
      additionalPrice: 5,
      rating: 4.5,
      feedback: "Great service!",
      customer: {
        fullName: "Demouser",
        email: "demouser@gmail.com",
        phoneNumber: "9941636316"
      },
      cleaningService: {
        name: "Laser tattoo removal",
        description: "Professional laser tattoo removal service"
      },
      note: "Please arrive on time",
      addressLine1: "123 Main Street",
      city: "Singapore",
      district: "Central",
      bookingAdditionals: [
        { name: "Extra cleaning", price: 5 }
      ]
    },
    isLoading: false
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(mockBookings.totalCount / ITEMS_PER_PAGE);
    if (pageIndex < totalPages) {
      setPageIndex(pageIndex + 1);
    }
  };

  // Status badge color mapping
  const getStatusBadgeColor = (status) => {
    const colors = {
      "in progress": "bg-purple-100 text-purple-800",
      pending: "bg-purple-100 text-purple-800",
      confirmed: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-50 text-red-700",
      completed: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "cancelled":
        return "destructive";
      case "in progress":
      case "pending":
      case "confirmed":
        return "purple";
      default:
        return "secondary";
    }
  };

  const handleFinishClick = (e, booking) => {
    e.stopPropagation(); // Prevent card click
    setSelectedFinishBooking(booking);
    setFinishDialogOpen(true);
  };

  const handleFinishSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // First upload the image and get the URL
      // TODO: Implement image upload to get imgUrl
      const imgUrls = []; // This should come from your image upload service

      // Submit the proof
      const proofData = {
        bookingId: selectedFinishBooking.id,
        proofs: completionProof.proofs  // Array of { title, imgUrl }
      };

      // TODO: API call to submit completion proof
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Reset states after successful submission
      setFinishDialogOpen(false);
      setSelectedFinishBooking(null);
      setCompletionProof({ proofs: [] });
      
      // TODO: Refresh booking list
    } catch (error) {
      console.error('Error submitting completion proof:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking List</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
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

          {/* Replace the card grid content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBookings.data.map((booking) => (
              <Card 
                key={booking.id}
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden relative"
                onClick={() => setSelectedBookingId(booking.id)}
              >
                {/* Add an image at the top */}
                <div className="relative h-40 bg-gray-100">
                  <img
                    src={booking.cleaningService.imageUrl || "/placeholder-service.jpg"}
                    alt={booking.cleaningService.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Title and Status */}
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-medium text-lg">{booking.cleaningService.name}</h3>
                      <Badge 
                        variant={getStatusVariant(booking.status)}
                        className={`rounded-full ${
                          booking.status === "cancelled" ? "bg-red-50 hover:bg-red-100 border-red-200" :
                          booking.status === "completed" ? "bg-green-100 hover:bg-green-200 border-green-200" :
                          "bg-purple-100 hover:bg-purple-200 border-purple-200"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[120px]">Booking Date</span>
                        <span className="text-gray-900">: {format(new Date(booking.preferDateStart), 'dd/MM/yyyy')}</span>
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
                              {booking.addressLine1}, {booking.district}, {booking.city}
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

                    {/* Add Finish Button for finishable bookings */}
                    {booking.isFinishable && booking.status === "in progress" && (
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

          {/* Booking Detail Dialog */}
          <Dialog open={selectedBookingId !== null} onOpenChange={(open) => !open && setSelectedBookingId(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-6 -mr-6">
                {mockBookingDetail.isLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Service Info Section */}
                    <div className="space-y-3">
                      <h3 className="font-medium border-b pb-2 sticky top-0 bg-white">Service Information</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Service:</div>
                        <div className="text-sm">{mockBookingDetail.data.cleaningService.name}</div>
                        
                        <div className="text-sm font-medium">Date:</div>
                        <div className="text-sm">{format(new Date(mockBookingDetail.data.preferDateStart), 'dd/MM/yyyy')}</div>
                        
                        <div className="text-sm font-medium">Time:</div>
                        <div className="text-sm">{mockBookingDetail.data.timeStart} - {mockBookingDetail.data.timeEnd}</div>
                        
                        <div className="text-sm font-medium">Status:</div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(mockBookingDetail.data.status)}`}>
                            {mockBookingDetail.data.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info Section */}
                    <div className="space-y-3">
                      <h3 className="font-medium border-b pb-2 sticky top-0 bg-white">Customer Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={mockBookingDetail.data.customer.avatarUrl} />
                            <AvatarFallback className="bg-primary/10">
                              {mockBookingDetail.data.customer.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{mockBookingDetail.data.customer.fullName}</div>
                            <div className="text-sm text-gray-500">{mockBookingDetail.data.customer.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <PhoneIcon className="h-4 w-4 text-gray-500" />
                          <span>{mockBookingDetail.data.customer.phoneNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-3">
                      <h3 className="font-medium border-b pb-2 sticky top-0 bg-white">Location Details</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm font-medium">Address:</div>
                          <div className="text-sm">{mockBookingDetail.data.addressLine1}</div>
                          
                          <div className="text-sm font-medium">District:</div>
                          <div className="text-sm">{mockBookingDetail.data.district}</div>
                          
                          <div className="text-sm font-medium">City:</div>
                          <div className="text-sm">{mockBookingDetail.data.city}</div>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown Section */}
                    <div className="space-y-3">
                      <h3 className="font-medium border-b pb-2 sticky top-0 bg-white">Price Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Service Price</span>
                          <span>₹{mockBookingDetail.data.servicePrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Distance Price</span>
                          <span>₹{mockBookingDetail.data.distancePrice}</span>
                        </div>
                        
                        {/* Additional Services */}
                        {mockBookingDetail.data.bookingAdditionals?.length > 0 && (
                          <>
                            <div className="pt-2 border-t">
                              <p className="font-medium mb-2">Additional Services:</p>
                              {mockBookingDetail.data.bookingAdditionals.map((item, index) => (
                                <div key={index} className="flex justify-between pl-2 text-gray-600">
                                  <span>• {item.name}</span>
                                  <span>₹{item.price}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Additional Total</span>
                              <span>₹{mockBookingDetail.data.additionalPrice}</span>
                            </div>
                          </>
                        )}

                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Total Amount</span>
                          <span>₹{mockBookingDetail.data.totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes Section */}
                    {mockBookingDetail.data.note && (
                      <div className="space-y-3">
                        <h3 className="font-medium border-b pb-2 sticky top-0 bg-white">Notes</h3>
                        <div className="text-sm bg-gray-50 p-3 rounded-md">
                          {mockBookingDetail.data.note}
                        </div>
                      </div>
                    )}

                    {/* Feedback Section */}
                    {mockBookingDetail.data.status === "completed" && (mockBookingDetail.data.rating || mockBookingDetail.data.feedback) && (
                      <div className="space-y-3">
                        <h3 className="font-medium border-b pb-2 sticky top-0 bg-white">Feedback</h3>
                        <div className="space-y-2">
                          {mockBookingDetail.data.rating && (
                            <div className="flex items-center gap-2">
                              <StarIcon className="h-5 w-5 text-yellow-400" />
                              <span className="text-sm">{mockBookingDetail.data.rating} / 5</span>
                            </div>
                          )}
                          {mockBookingDetail.data.feedback && (
                            <div className="text-sm bg-gray-50 p-3 rounded-md">
                              {mockBookingDetail.data.feedback}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
                    {completionProof.proofs.map((proof, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`title-${index}`}>Title for Image {index + 1}</Label>
                          <Input
                            id={`title-${index}`}
                            value={proof.title}
                            onChange={(e) => {
                              const newProofs = [...completionProof.proofs];
                              newProofs[index].title = e.target.value;
                              setCompletionProof(prev => ({ ...prev, proofs: newProofs }));
                            }}
                            placeholder="Enter proof title"
                            maxLength={255}
                          />
                        </div>
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={proof.imgUrl}
                            alt={`Proof ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => {
                              const newProofs = [...completionProof.proofs];
                              newProofs.splice(index, 1);
                              setCompletionProof(prev => ({ ...prev, proofs: newProofs }));
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                    {completionProof.proofs.length < 4 && (
                      <label className="cursor-pointer">
                        <div className="aspect-video border-2 border-dashed rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              // TODO: Handle image upload and get URL
                              const file = e.target.files[0];
                              // Temporary local URL for preview
                              const localUrl = URL.createObjectURL(file);
                              setCompletionProof(prev => ({
                                ...prev,
                                proofs: [...prev.proofs, { title: '', imgUrl: localUrl }]
                              }));
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Upload up to 4 images as proof</p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setFinishDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFinishSubmit}
                    disabled={
                      isSubmitting || 
                      completionProof.proofs.length === 0 || 
                      completionProof.proofs.some(proof => !proof.title.trim())
                    }
                  >
                    {isSubmitting ? (
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
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Page {pageIndex} of {Math.ceil(mockBookings.totalCount / ITEMS_PER_PAGE)}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={pageIndex === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={pageIndex === Math.ceil(mockBookings.totalCount / ITEMS_PER_PAGE)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HouseKeeperBookingList;