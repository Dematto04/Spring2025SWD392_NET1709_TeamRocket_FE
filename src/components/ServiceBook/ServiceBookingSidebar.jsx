import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CircleCheck, MapPin, DollarSign, ImageIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const bookingSteps = ["Additional Services", "Date & Time", "Personal Information"];

function ServiceBookingSidebar({ step, currentStep = 0, service }) {
  return (
    <Card className="w-56 rounded-lg">
      <CardHeader className="p-4 space-y-4">
        <CardTitle className="text-lg font-semibold">Service Detail</CardTitle>
        <div className="space-y-4 rounded-lg border bg-card p-3">
          {/* Service Image */}
          <div className="w-full h-32 rounded-md overflow-hidden bg-muted">
            {service?.images?.[0]?.url ? (
              <AspectRatio ratio={4/3}>
                <img
                  src={service.images[0].url}
                  className="w-full h-full object-cover"
                  alt={service?.name || "Service image"}
                />
              </AspectRatio>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Service Info */}
          <div className="space-y-2">
            <h3 className="font-medium leading-none line-clamp-2">
              {service?.name}
            </h3>
            
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{service?.location}</span>
            </div>

            <div className="flex items-center gap-1.5 text-sm font-medium">
              <DollarSign className="h-3.5 w-3.5" />
              <span>{service?.price}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <CardTitle className="mb-4">Booking Steps</CardTitle>
        <div className="flex flex-col">
          {bookingSteps.map((item, idx) => (
            <div key={idx}>
              <div className="flex gap-2 items-center">
                <CircleCheck
                  size={16}
                  className={`shrink-0 text-green-500 duration-300 ${
                    idx < step ? "text-slate-200 fill-green-500" : ""
                  }`}
                />
                <span className="text-sm">{item}</span>
              </div>
              {idx !== bookingSteps.length - 1 && (
                <Separator
                  orientation="vertical"
                  className="h-8 w-[2px] ml-[7px] my-1"
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ServiceBookingSidebar;
