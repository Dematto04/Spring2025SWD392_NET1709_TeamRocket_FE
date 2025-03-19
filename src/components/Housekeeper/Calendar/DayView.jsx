// src/components/DayView.js
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

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
            <span className="font-medium">Time:</span>
            <span className="col-span-3">
              {booking.timeStart.slice(0, 5)} - {booking.timeEnd.slice(0, 5)}
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

const parseTimeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const getBookingColor = (booking) => {
  const statusColors = {
    Canceled: "bg-red-500 dark:bg-red-600 text-white",
    OnGoing: "bg-yellow-500 dark:bg-yellow-600 text-white",
    Refunded: "bg-orange-500 dark:bg-orange-600 text-white",
    Completed: "bg-green-500 dark:bg-green-600 text-white",
  };

  return (
    statusColors[booking.status] ||
    "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
  );
};

const DayView = ({ days = [] }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!days || days.length === 0) {
    return (
      <div className="text-center p-4 text-gray-600 dark:text-gray-400">
        No data available
      </div>
    );
  }

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const day = days[0];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Group bookings by their start hour
  const bookingsByHour = day.bookings.reduce((acc, booking) => {
    const startHour = parseInt(booking.timeStart.split(":")[0], 10);
    if (!acc[startHour]) {
      acc[startHour] = [];
    }
    acc[startHour].push(booking);
    return acc;
  }, {});

  return (
    <div className="overflow-auto">
      <table className="w-full min-w-[600px] border-collapse bg-white dark:bg-gray-800">
        <tbody>
          {hours.map((hour) => (
            <tr key={hour} className="border-b dark:border-gray-700">
              <td className="w-24 p-2 text-right text-sm text-gray-600 dark:text-gray-400 border-r dark:border-gray-700">
                {`${hour.toString().padStart(2, '0')}:00`}
              </td>
              <td className="p-2 h-20 relative">
                {bookingsByHour[hour]?.map((booking) => (
                  <div
                    key={booking.id}
                    className={cn(
                      "absolute left-2 right-2 rounded-md p-2 text-sm transition-colors hover:opacity-90 cursor-pointer shadow-sm",
                      getBookingColor(booking)
                    )}
                    style={{
                      top: `${(parseTimeToMinutes(booking.timeStart) % 60) / 60 * 100}%`,
                      height: `${Math.min(
                        (parseTimeToMinutes(booking.timeEnd) - parseTimeToMinutes(booking.timeStart)) / 60 * 80,
                        80
                      )}px`,
                      minHeight: "40px",
                    }}
                    onClick={() => handleBookingClick(booking)}
                  >
                    <div className="font-semibold truncate">{booking.serviceName}</div>
                    <div className="text-xs">{`${booking.timeStart.slice(0, 5)} - ${booking.timeEnd.slice(0, 5)}`}</div>
                    <div className="text-xs truncate">{booking.customerName}</div>
                    <div className="text-xs font-medium mt-1">{booking.status}</div>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <BookingDialog
        booking={selectedBooking}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default DayView;
