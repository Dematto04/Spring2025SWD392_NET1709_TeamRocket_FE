import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { MapPin, Clock, ImageIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function CheckoutItems({ checkout }) {
  const bookingDate = checkout?.booking_date ? new Date(checkout.booking_date) : null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Booking Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">{checkout?.service_name}</h3>
              <div className="flex items-center gap-2">
                <span className="font-medium">Base Price:</span>
                <span className="text-muted-foreground">${checkout?.base_service_price}</span>
              </div>
            </div>
            <div className="w-full md:w-40 h-40 rounded-lg overflow-hidden border bg-muted">
              {checkout?.url ? (
                <AspectRatio ratio={1}>
                  <img
                    src={checkout.url}
                    alt={checkout?.service_name}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Additional Services */}
          {checkout?.additional_services && checkout.additional_services.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Additional Services</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                {checkout.additional_services.map((item) => (
                  <div
                    key={item.additional_service_id}
                    className="flex gap-3 p-3 rounded-lg border bg-card"
                  >
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {item.url ? (
                        <AspectRatio ratio={1}>
                          <img
                            src={item.url}
                            alt={item.additional_service_name}
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {item.additional_service_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${item.additional_service_price}
                      </p>
                      {item.duration && (
                        <p className="text-xs text-muted-foreground">
                          Duration: {item.duration} minutes
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Date & Time */}
        <div className="space-y-2">
          <h3 className="font-medium">Scheduled Date & Time</h3>
          <div className="grid gap-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {bookingDate && format(bookingDate, "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2 ml-6">
              <span>Start: {checkout?.start_time?.slice(0, 5)}</span>
              <span>•</span>
              <span>End: {checkout?.end_time?.slice(0, 5)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Address Information */}
        <div className="space-y-2">
          <h3 className="font-medium">Delivery Address</h3>
          <div className="grid gap-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5" />
              <div>
                <p>{checkout?.address}</p>
                <p className="text-xs">{checkout?.city}, {checkout?.district}</p>
                {checkout?.distance && (
                  <p className="text-xs">Distance: {checkout.distance}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
