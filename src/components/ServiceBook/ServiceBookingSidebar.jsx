import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CircleCheck } from "lucide-react";
import { Separator } from "../ui/separator";
const steps = ["Additional Services", "Date & Time", "Personal Information"];
function ServiceBookingSidebar({step, currentStep = 0}) {
  return (
    <Card className="w-56  rounded-lg">
      <CardHeader className="p-4">
        <CardTitle>Service Detail</CardTitle>
        <CardDescription>
          <div className="flex mt-4 gap-2 items-start justify-between bg-[rgba(37,99,255,0.2) p-2]">
            <img
              src="/home-cleaning.webp"
              className="w-10 h-10 border rounded-md object-cover"
              alt=""
            />
            <span className="">Electric Panel Repairing Service</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle>Booking</CardTitle>
        <div className="flex flex-col mt-4">
          {steps.map((item, idx) => (
            <>
              <div className="flex gap-1 items-center">
                <CircleCheck size={16} className={`text-green-500 duration-1000 ${idx < step ? "text-slate-200 fill-green-500" : ""}`} />
                <span className="text-sm">{item}</span>
              </div>
              {idx !== 2 && (
                <Separator
                  orientation="vertical"
                  className="h-8 w-[2px] ml-[6.5px]"
                />
              )}
            </>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ServiceBookingSidebar;
