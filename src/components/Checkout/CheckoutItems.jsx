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
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function CheckoutItems({ checkout }) {
  const bookingDate = checkout?.booking_date ? new Date(checkout.booking_date) : null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Booking Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                {checkout?.service_name}
                {/* Additional Services */}
                {checkout?.additional_services && checkout.additional_services.length > 0 && (
                  <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {checkout.additional_services.map((item) => (
                      <div key={item.additional_service_id} className="flex items-center gap-2">
                        <span>• {item.additional_service_name}</span>
                        <span className="text-xs text-muted-foreground">
                          (${item.additional_service_price})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="font-medium">${checkout?.base_service_price}</div>
                {checkout?.additional_price > 0 && (
                  <div className="text-sm text-muted-foreground mt-1">
                    +${checkout.additional_price} additional
                  </div>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

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
