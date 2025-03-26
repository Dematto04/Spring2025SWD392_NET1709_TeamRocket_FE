import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Clock, MapPin, ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function RequestDetailOverview({ 
  overview, 
  additionalServices, 
  duration, 
  serviceTimeSlots,
  serviceSteps,
  serviceDistanceRule 
}) {
  return (
    <div className="space-y-8">
      {/* Service Description */}
      <Card>
        <CardHeader>
          <CardTitle>Service Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{overview}</p>
        </CardContent>
      </Card>

      {/* Service Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks size={20} />
            Service Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {step.step_order}
                </div>
                <div>
                  <h3 className="font-medium">{step.step_description}</h3>
                  <p className="text-sm text-muted-foreground">
                    Duration: {step.step_duration} minutes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Duration and Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={20} />
            Duration & Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground" />
              <span>Total Duration: {duration} {duration === 1 ? 'hour' : 'hours'}</span>
            </div>
            
            {serviceTimeSlots.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Available Time Slots</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {serviceTimeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={14} />
                      {slot.day_of_week}: {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Distance Rules */}
      {serviceDistanceRule && serviceDistanceRule.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin size={20} />
              Distance Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {serviceDistanceRule.map((rule, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  <p>• Distance Range: {rule.min_distance}km - {rule.max_distance}km</p>
                  <p>• Fee: ${rule.base_fee}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Services */}
      {additionalServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalServices.map((item, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.url || "/home-cleaning.webp"}
                        className="w-20 h-20 object-cover rounded-lg"
                        alt={item.additional_service_name}
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium">{item.additional_service_name}</h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          Duration: {item.duration} minutes
                        </p>
                      </div>
                      <div className="mt-2">
                        <span className="text-lg font-medium text-primary">
                          ${item.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default RequestDetailOverview;