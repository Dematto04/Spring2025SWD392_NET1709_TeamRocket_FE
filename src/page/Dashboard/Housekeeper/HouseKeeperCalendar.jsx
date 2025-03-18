import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  DollarSign,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, 
  startOfWeek, endOfWeek, addDays, parseISO, setHours } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetBookingCalendarQuery } from '@/redux/api/serviceApi';

function HouseKeeperCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [navigationMode, setNavigationMode] = useState('today');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDateBookings, setSelectedDateBookings] = useState(null);

  // Map view state to API viewMode
  const viewModeMap = {
    month: 'Month',
    week: 'Week',
    day: 'Day'
  };

  // Format Date to ISO 8601 string (e.g., "2025-03-12T13:55:41.420Z")
  const formatToISO = (date) => date.toISOString();

  // Fetch bookings from API
  const { data, isLoading } = useGetBookingCalendarQuery({
    referenceDate: formatToISO(currentDate),
    navigationMode: navigationMode,
    viewMode: viewModeMap[view]
  });

  const bookingsData = data?.data?.days || [];

  // Update currentDate based on API response
  useEffect(() => {
    if (data?.data?.days?.length) {
      const firstDay = parseISO(data.data.days[0].date);
      if (navigationMode === 'next') {
        setCurrentDate(view === 'month' ? addMonths(currentDate, 1) :
                       view === 'week' ? addDays(currentDate, 7) :
                       addDays(currentDate, 1));
      } else if (navigationMode === 'previous') {
        setCurrentDate(view === 'month' ? subMonths(currentDate, 1) :
                       view === 'week' ? addDays(currentDate, -7) :
                       addDays(currentDate, -1));
      }
      // Reset navigationMode to 'today' after updating currentDate
      setNavigationMode('today');
    }
  }, [data, navigationMode, view]);

  useEffect(() => {
    // Reset navigationMode to 'today' when view changes
    setNavigationMode('today');
  }, [view]);

  const getBookingsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = bookingsData.find(day => format(parseISO(day.date), 'yyyy-MM-dd') === dateStr);
    return dayData?.bookings.map(booking => ({
      id: booking.id,
      date: format(parseISO(booking.preferDateStart), 'yyyy-MM-dd'),
      timeStart: booking.timeStart.slice(0, 5), // Trim to HH:mm
      timeEnd: booking.timeEnd.slice(0, 5),   // Trim to HH:mm
      serviceName: booking.serviceName,
      status: 'pending', // API doesn't provide status, assuming pending as default
      customer: {
        name: booking.customerName,
        avatar: '', // Add logic if API provides avatar
        phone: ''   // Add if API provides phone
      },
      location: booking.address,
      price: booking.totalPrice,
      note: '' // Add if API provides notes
    })) || [];
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-pink-500';
      case 'cancelled': return 'bg-red-500';
      case 'in_progress': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'in_progress': return 'default';
      default: return 'secondary';
    }
  };

  const renderBookings = (date, isWeekView = false) => {
    const bookings = getBookingsForDate(date);
    if (!bookings.length) return null;

    const displayLimit = 2;
    const isExpanded = selectedDateBookings && format(date, 'yyyy-MM-dd') === selectedDateBookings.date;
    const visibleBookings = isWeekView || isExpanded ? bookings : bookings.slice(0, displayLimit);
    const remainingCount = bookings.length - displayLimit;

    return (
      <div className={cn("mt-1 space-y-1", isWeekView && "ml-16")}>
        {visibleBookings.map((booking) => (
          <div
            key={booking.id}
            className={cn(
              "text-xs p-2 rounded truncate text-white cursor-pointer hover:opacity-90 transition-opacity",
              getStatusColor(booking.status)
            )}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBooking(booking);
            }}
          >
            <div className="font-medium">{booking.timeStart} - {booking.timeEnd}</div>
            <div className="flex items-center gap-1">
              <Avatar className="h-4 w-4">
                <AvatarImage src={booking.customer.avatar} />
                <AvatarFallback>{booking.customer.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="truncate">{booking.serviceName}</span>
            </div>
          </div>
        ))}
        {!isWeekView && !isExpanded && remainingCount > 0 && (
          <div 
            className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDateBookings({ 
                date: format(date, 'yyyy-MM-dd'),
                bookings,
                formattedDate: format(date, 'MMMM d, yyyy')
              });
            }}
          >
            +{remainingCount} more
          </div>
        )}
        {!isWeekView && isExpanded && (
          <div 
            className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDateBookings(null);
            }}
          >
            Show less
          </div>
        )}
      </div>
    );
  };

  const renderMonthView = () => {
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate)
    });

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {daysInMonth.map((date) => (
          <div
            key={date.toISOString()}
            className={cn(
              "bg-white p-2 min-h-[120px]",
              !isSameMonth(date, currentDate) && "text-gray-400 bg-gray-50",
              isToday(date) && "bg-blue-50"
            )}
          >
            <div className="font-medium text-sm">
              {format(date, 'd')}
            </div>
            {renderBookings(date)}
          </div>
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-1 gap-px bg-gray-200">
        {daysInWeek.map((date) => (
          <div
            key={date.toISOString()}
            className={cn(
              "bg-white p-2 min-h-[100px] flex",
              !isSameMonth(date, currentDate) && "text-gray-400",
              isToday(date) && "bg-blue-50"
            )}
          >
            <div className="font-medium text-sm w-16">
              {format(date, 'EEE d')}
            </div>
            {renderBookings(date, true)}
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayBookings = getBookingsForDate(currentDate);

    return (
      <div className="grid grid-cols-1 gap-px bg-gray-200">
        {hours.map((hour) => {
          const timeSlot = setHours(currentDate, hour);
          const slotBookings = dayBookings.filter(booking => {
            const bookingStart = parseISO(`${booking.date}T${booking.timeStart}`);
            return format(bookingStart, 'H') === format(timeSlot, 'H');
          });

          return (
            <div
              key={hour}
              className={cn(
                "bg-white p-2 min-h-[60px] flex",
                hour % 2 === 0 && "bg-gray-50"
              )}
            >
              <div className="font-medium text-sm w-16">
                {format(timeSlot, 'HH:mm')}
              </div>
              <div className="flex-1 ml-4">
                {slotBookings.map(booking => (
                  <div
                    key={booking.id}
                    className={cn(
                      "text-xs p-2 rounded text-white cursor-pointer hover:opacity-90 transition-opacity",
                      getStatusColor(booking.status)
                    )}
                    onClick={() => setSelectedBooking(booking)}
                  >
                    {booking.serviceName}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const previousPeriod = () => {
    setNavigationMode('previous'); // Set navigationMode first to trigger API call
  };

  const nextPeriod = () => {
    setNavigationMode('next'); // Set navigationMode first to trigger API call
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setNavigationMode('today');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        
        <div className="flex items-center gap-2">
          <div className="flex">
            <Button variant="outline" size="icon" onClick={previousPeriod}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="mx-2" onClick={goToToday}>
              today
            </Button>
            <Button variant="outline" size="icon" onClick={nextPeriod}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <h2 className="text-xl font-semibold mx-4">
            {data?.data?.displayRange || format(currentDate, 'MMMM yyyy')}
          </h2>

          <div className="flex rounded-md shadow-sm">
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              onClick={() => setView('month')}
              className="rounded-l-md rounded-r-none"
            >
              month
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              onClick={() => setView('week')}
              className="rounded-none border-l-0 border-r-0"
            >
              week
            </Button>
            <Button
              variant={view === 'day' ? 'default' : 'outline'}
              onClick={() => setView('day')}
              className="rounded-r-md rounded-l-none"
            >
              day
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg shadow bg-white">
        {view === 'month' && (
          <>
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="bg-white p-2 text-center text-sm font-semibold">
                  {day}
                </div>
              ))}
            </div>
            {renderMonthView()}
          </>
        )}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedBooking.serviceName}</h3>
                  <Badge variant={getStatusBadgeVariant(selectedBooking.status)}>
                    {selectedBooking.status.replace('_', ' ')}
                  </Badge>
                </div>
                <Button variant="outline" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-[20px_1fr] gap-x-2 gap-y-3 items-start">
                <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium">Time</div>
                  <div className="text-sm text-gray-600">
                    {selectedBooking.date} {selectedBooking.timeStart} - {selectedBooking.timeEnd}
                  </div>
                </div>

                <User className="w-4 h-4 text-gray-500 mt-0.5" />
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedBooking.customer.avatar} />
                    <AvatarFallback>{selectedBooking.customer.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedBooking.customer.name}</div>
                    <div className="text-sm text-gray-600">{selectedBooking.customer.phone || 'N/A'}</div>
                  </div>
                </div>

                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-gray-600">{selectedBooking.location}</div>
                </div>

                <DollarSign className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium">Price</div>
                  <div className="text-sm text-gray-600">${selectedBooking.price.toFixed(2)}</div>
                </div>

                {selectedBooking.note && (
                  <>
                    <Pencil className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Note</div>
                      <div className="text-sm text-gray-600">{selectedBooking.note}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* More Bookings Dialog */}
      <Dialog open={!!selectedDateBookings} onOpenChange={() => setSelectedDateBookings(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              More Bookings for {selectedDateBookings?.formattedDate}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDateBookings && (
            <div className="space-y-3">
              {selectedDateBookings.bookings.map(booking => (
                <div 
                  key={booking.id}
                  className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedDateBookings(null);
                    setSelectedBooking(booking);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{booking.timeStart} - {booking.timeEnd}</div>
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {booking.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={booking.customer.avatar} />
                      <AvatarFallback>{booking.customer.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{booking.serviceName}</div>
                      <div className="text-sm text-gray-600">{booking.customer.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HouseKeeperCalendar;