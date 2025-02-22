import React, { useContext, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { containerVariants } from "@/lib/utils";
import { Button } from "../ui/button";
import { ServiceBookContext } from "./ServiceBookContext";

function ServiceDateTime() {
    const {time, setTime, date, setDate} = useContext(ServiceBookContext)
  
  
  const handleSelect = (data) => {
    console.log({ data });
    setDate(data);
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
            selected={date}
            onSelect={handleSelect}
            className="rounded-md border w-fit"
          />
        </div>
        <div>
          <h2 className="text-sm mb-2">Select time</h2>
          <div className="grid grid-cols-3 gap-4">
            {Array(7)
              .fill(1)
              .map((_, idx) => (
                <Button key={idx} variant={idx === time ? "default": "outline"} onClick={()=>setTime(idx)} className="py-6 px-8">9:30 - 10:00</Button>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ServiceDateTime;
