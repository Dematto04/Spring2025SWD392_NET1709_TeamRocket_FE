import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Clock } from "lucide-react";

function RequestDetailOverview({ overview, additionalServices, duration, serviceTimeSlots }) {
  return (
    <div>
      <h1 className="text-2xl font-medium mt-8">Service Overview</h1>
      <p className="mt-4">{overview}</p>

      {/* Duration */}
      <div className="mt-4">
        <h2 className="text-lg font-medium">Duration</h2>
        <p className="flex items-center gap-2">
          <Clock size={16} />
          {duration} hours
        </p>
      </div>

      {/* Service Time Slots */}
      {serviceTimeSlots.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-medium">Available Time Slots</h2>
          <ul className="mt-2 space-y-2">
            {serviceTimeSlots.map((slot, index) => (
              <li key={index} className="flex items-center gap-2">
                <Clock size={16} />
                {slot.day_of_week}: {slot.start_time} - {slot.end_time}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Services */}
      {additionalServices.length > 0 && (
        <div className="mt-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <h1 className="text-2xl font-medium mt-8">Additional Services</h1>
              </AccordionTrigger>
              <AccordionContent>
                {additionalServices.map((item, i) => (
                  <div
                    key={i}
                    className="min-h-40 md:h-40 shadow-lg rounded-lg md:p-6 mt-4 hover:-translate-y-2 duration-500"
                  >
                    <div className="h-full flex gap-4 flex-wrap md:flex-nowrap">
                      <div className="md:shrink-0">
                        <img
                          src={item.url || "/home-cleaning.webp"}
                          className="h-full object-contain rounded-lg"
                          alt={item.additional_service_name}
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-grow">
                        <div>
                          <h2 className="text-xl font-medium">
                            {item.additional_service_name}
                          </h2>
                          {item.description && (
                            <p className="text-sm text-gray-600">{item.description}</p>
                          )}
                          Duration: {item.duration} hours
                        </div>
                        <div className="flex flex-col items-end justify-end">
                          <span className="text-lg text-primary font-medium">
                            ${item.amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
}

export default RequestDetailOverview;