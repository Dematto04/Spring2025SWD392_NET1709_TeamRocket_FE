import React, { useContext, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { containerVariants } from "@/lib/utils";
import { Button } from "../ui/button";
import { ServiceBookContext } from "./ServiceBookContext";
import { useGetTimeSlotsMutation } from "@/redux/api/serviceApi";
import { useParams } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function ServiceDateTime() {
  const { time, setTime, date, setDate } = useContext(ServiceBookContext);
  const { id } = useParams();
  const [getTimeSlots, { data, isLoading }] = useGetTimeSlotsMutation();
  const handleSelectCalendar = async (data) => {
    console.log(data);
    const date = new Date(data);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const result = await getTimeSlots({
      serviceId: id,
      targetDate: data,
      dayOfWeek: dayOfWeek,
    });
    setDate({
      serviceId: id,
      targetDate: data,
      dayOfWeek: dayOfWeek,
    });
  };
  return (
    <motion.div
      className="min-h-80"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="font-semibold leading-none tracking-tight mb-4">
        Select Date and Time
      </h1>
      <div className="flex gap-10">
        <div>
          <h2 className="text-sm mb-2">Select date</h2>
          <Calendar
            mode="single"
            selected={date.targetDate}
            onSelect={handleSelectCalendar}
            className="rounded-md border w-fit"
          />
        </div>
        <div>
          <h2 className="text-sm mb-2">Select time</h2>
          <div className="grid grid-cols-3 gap-4">
            {isLoading ? (
              <Skeleton className="w-36 h-[50px]" />
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((slot, idx) => (
                <Button
                  key={slot.id}
                  variant={slot.id === time ? "default" : "outline"}
                  onClick={() => setTime(slot.id)}
                  className="py-6 px-8"
                >
                  {slot.timeStart.slice(0, 5)} - {slot.timeEnd.slice(0, 5)}
                </Button>
              ))
            ) : (
              <div className="">There is no time slot for chosen day!</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ServiceDateTime;
