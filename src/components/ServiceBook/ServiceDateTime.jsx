import React, { useContext, useState, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { cn, containerVariants } from "@/lib/utils";
import { Button } from "../ui/button";
import { ServiceBookContext } from "./ServiceBookContext";
import { useGetTimeSlotsMutation } from "@/redux/api/serviceApi";
import { useParams } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { useDispatch } from "react-redux";
import { timeSlot } from "@/redux/features/bookingSlice";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "../ui/card";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TimeSlotGrid = ({
  slots,
  selectedDate,
  onSelectSlot,
  selectedSlot,
  date,
}) => {
  const dispatch = useDispatch();
  if (!slots || slots.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No time slots available for the selected date
      </div>
    );
  }

  console.log(selectedSlot);

  return (
    <div className="grid grid-cols-3 gap-3">
      {slots.map((slot) => (
        <Button
          key={slot.id}
          variant={
            slot.id === selectedSlot?.id && selectedSlot?.day === selectedDate
              ? "default"
              : "outline"
          }
          className={cn("py-6 hover:border-primary transition-colors")}
          onClick={() => {
            onSelectSlot({
              ...slot,
              day: selectedDate,
            });
            dispatch(
              timeSlot({
                ...slot,
                day: selectedDate,
              })
            );
          }}
        >
          <Clock className="w-4 h-4 mr-2" />
          <span>
            {slot.timeStart.slice(0, 5)} - {slot.timeEnd.slice(0, 5)}
          </span>
        </Button>
      ))}
    </div>
  );
};

const LoadingState = () => (
  <div className="grid grid-cols-3 gap-3">
    {[...Array(6)].map((_, i) => (
      <Skeleton key={i} className="h-[52px] w-full" />
    ))}
  </div>
);

function ServiceDateTime() {
  const { id } = useParams();
  const [getTimeSlots, { data: slots, isLoading }] = useGetTimeSlotsMutation();
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSelectDate = async (selectedDate) => {
    if (!selectedDate) return;
    console.log({ selectedDate });

    const utcDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
    );

    const dayOfWeek = daysOfWeek[utcDate.getUTCDay()];
    const formattedDate = utcDate.toISOString();

    // Get time slots for the selected date
    const response = await getTimeSlots({
      serviceId: id,
      targetDate: formattedDate,
      dayOfWeek: dayOfWeek,
    });
    console.log({ response });

    if (response?.data?.data?.length === 0) {
      setSelectedDate(null);
      setSelectedSlot(null);
      dispatch(timeSlot(null));
      return;
    }
    setSelectedDate(formattedDate);
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Select Date and Time
        </h1>
        <p className="text-muted-foreground">
          Choose your preferred date and time slot for the service
        </p>
        <h2 className="font-medium">
          Your Service Schedulue will be:{" "}
          {(!selectedDate || !selectedSlot) && "Not Selected"}
        </h2>
        {selectedDate && selectedSlot && (
          <h2 className="font-medium">
            {new Date(selectedSlot.day).toLocaleDateString()}, at{" "}
            {selectedSlot.timeStart.slice(0, 5)} -{" "}
            {selectedSlot.timeEnd.slice(0, 5)}
          </h2>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <Card className="border-2 flex-1">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <h2 className="font-medium">Select Date</h2>
            </div>
            <Calendar
              mode="single"
              className="rounded-md border w-fit mx-auto"
              selected={selectedDate ? new Date(selectedDate) : undefined}
              onSelect={handleSelectDate}
              disabled={(date) => date < new Date()}
            />
          </CardContent>
        </Card>

        <Card className="border-2 flex-1">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="font-medium">Select Time</h2>
            </div>
            {isLoading ? (
              <LoadingState />
            ) : (
              <TimeSlotGrid
                slots={slots?.data}
                selectedDate={selectedDate}
                onSelectSlot={setSelectedSlot}
                selectedSlot={selectedSlot}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

export default ServiceDateTime;
