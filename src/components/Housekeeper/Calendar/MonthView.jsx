// src/components/MonthView.js
import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  parseISO,
} from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
            <span className="font-medium">Total Price:</span>
            <span className="col-span-3">${booking.totalPrice}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getBookingColor = (booking) => {
  const statusColors = {
    Canceled: "bg-red-500 dark:bg-red-600 text-white",
    OnGoing: "bg-yellow-500 dark:bg-yellow-600 text-white",
    Refunded: "bg-orange-500 dark:bg-orange-600 text-white",
    Completed: "bg-green-500 dark:bg-green-600 text-white",
  };

  const serviceColors = {
    "Best Food Deliver": "bg-amber-700 dark:bg-amber-800 text-white",
    "Apartment Cleaning Service": "bg-pink-500 dark:bg-pink-600 text-white",
    "Wood Cutting Service": "bg-indigo-600 dark:bg-indigo-700 text-white",
    "Laser tattoo removal": "bg-pink-500 dark:bg-pink-600 text-white",
  };

  return (
    statusColors[booking.status] ||
    serviceColors[booking.serviceName] ||
    "bg-gray-500 dark:bg-gray-600 text-white"
  );
};

const MonthView = ({ bookingData, currentDate }) => {
  const [expandedDates, setExpandedDates] = useState(new Set());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const bookingsByDate = (bookingData?.days || []).reduce((acc, day) => {
    const date = format(parseISO(day.date), "yyyy-MM-dd");
    acc[date] = day.bookings;
    return acc;
  }, {});

  const toggleExpanded = (dateKey) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(dateKey)) {
      newExpanded.delete(dateKey);
    } else {
      newExpanded.add(dateKey);
    }
    setExpandedDates(newExpanded);
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  if (!bookingData) {
    return <div className="text-center p-4 text-gray-600 dark:text-gray-400">Loading calendar data...</div>;
  }

  return (
    <div className="month-view">
      <div className="grid grid-cols-7 border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg">
        {/* Header row */}
        <div className="col-span-7 grid grid-cols-7">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-sm font-medium border-b border-r dark:border-gray-700 text-gray-900 dark:text-gray-100">
              {day}
            </div>
          ))}
        </div>
        <div className="col-span-7 grid grid-cols-7">
          {days.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayBookings = bookingsByDate[dateKey] || [];
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isExpanded = expandedDates.has(dateKey);
            const displayedBookings = isExpanded
              ? dayBookings
              : dayBookings.slice(0, 2);
            const hasMoreBookings = !isExpanded && dayBookings.length > 2;

            return (
              <div
                key={dateKey}
                className={cn(
                  "min-h-[120px] p-2 border-b border-r dark:border-gray-700 relative",
                  !isCurrentMonth && "bg-gray-50 dark:bg-gray-800/50"
                )}
              >
                <div className="text-sm mb-1 text-end text-gray-900 dark:text-gray-100">{day.getDate()}</div>
                <div className="space-y-1">
                  {displayedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className={cn(
                        "p-1 rounded text-xs cursor-pointer hover:opacity-80",
                        getBookingColor(booking)
                      )}
                      onClick={() => handleBookingClick(booking)}
                    >
                      <div className="font-medium">{booking.serviceName}</div>
                      <div className="text-xs opacity-90">
                        {format(parseISO(booking.preferDateStart), "yyyy-MM-dd")}
                      </div>
                      <div className="text-xs opacity-90">{booking.status}</div>
                    </div>
                  ))}
                  {(hasMoreBookings || isExpanded) && dayBookings.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-0 h-auto"
                      onClick={() => toggleExpanded(dateKey)}
                    >
                      {isExpanded
                        ? "Show less"
                        : `+${dayBookings.length - 2} more`}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BookingDialog
        booking={selectedBooking}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default MonthView;
