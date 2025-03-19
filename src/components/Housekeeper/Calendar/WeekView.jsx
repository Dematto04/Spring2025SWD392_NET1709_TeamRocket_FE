// src/components/WeekView.js
import { format, parseISO, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from "@/lib/utils";
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BookingDialog = ({ booking, open, onOpenChange }) => {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{booking.serviceName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Status:</span>
            <span className="col-span-3">{booking.status}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Customer:</span>
            <span className="col-span-3">{booking.customerName}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Date:</span>
            <span className="col-span-3">
              {format(parseISO(booking.preferDateStart), "PPP")}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Time:</span>
            <span className="col-span-3">
              {booking.timeStart.slice(0,5)} - {booking.timeEnd.slice(0,5)}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Address:</span>
            <span className="col-span-3">{booking.address}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Price:</span>
            <span className="col-span-3">${booking.totalPrice}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getBookingColor = (booking) => {
  // Status colors with dark mode support
  const statusColors = {
    'Canceled': 'bg-red-500 dark:bg-red-600 text-white',
    'OnGoing': 'bg-yellow-500 dark:bg-yellow-600 text-white',
    'Refunded': 'bg-orange-500 dark:bg-orange-600 text-white',
    'Completed': 'bg-green-500 dark:bg-green-600 text-white'
  };

  return statusColors[booking.status] || 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100';
};

const WeekView = ({ days = [] }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  
  const firstDay = days.length > 0 ? parseISO(days[0].date) : new Date();
  

  const weekStart = startOfWeek(firstDay);
  const weekEnd = endOfWeek(firstDay);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  
  const bookingsByDate = days.reduce((acc, day) => {
    if (day && day.date) {
      acc[format(parseISO(day.date), 'yyyy-MM-dd')] = day.bookings || [];
    }
    return acc;
  }, {});

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 min-w-[700px] border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        {/* Header row */}
        {weekDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayBookings = bookingsByDate[dateKey] || [];
          const isToday = format(new Date(), 'yyyy-MM-dd') === dateKey;

          return (
            <div key={dateKey} className="flex flex-col border-r dark:border-gray-700 last:border-r-0">
              <div className={cn(
                "text-center p-2 border-b dark:border-gray-700 font-medium",
                isToday ? "bg-blue-50 dark:bg-blue-900/20" : "bg-gray-50 dark:bg-gray-800"
              )}>
                <div className="text-gray-900 dark:text-gray-100">{format(day, 'EEE')}</div>
                <div className={cn(
                  "text-sm",
                  isToday ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 dark:text-gray-400"
                )}>
                  {format(day, 'd')}
                </div>
              </div>
              <div className="space-y-2 p-2 min-h-[200px] bg-white dark:bg-gray-800">
                {dayBookings.length === 0 ? (
                  <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-2">No bookings</div>
                ) : (
                  dayBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className={cn(
                        "p-2 rounded text-xs cursor-pointer hover:opacity-80 shadow-sm",
                        getBookingColor(booking)
                      )}
                      onClick={() => handleBookingClick(booking)}
                    >
                      <div className="font-medium">{booking.serviceName}</div>
                      <div>{booking.customerName}</div>
                      <div>{`${booking.timeStart.slice(0, 5)} - ${booking.timeEnd.slice(0, 5)}`}</div>
                      <div className="mt-1 font-medium">{booking.status}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      <BookingDialog
        booking={selectedBooking}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default WeekView;