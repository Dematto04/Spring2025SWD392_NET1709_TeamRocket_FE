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
              <TableCell className="font-medium">{checkout?.service_name}</TableCell>
              <TableCell className="text-right font-medium">
                ${checkout?.base_service_price}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Additional Services List */}
        <div className="space-y-2">
          <h3 className="font-medium">Additional Services</h3>
          {checkout?.additional_services && checkout.additional_services.length > 0 ? (
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {checkout.additional_services.map((item) => (
                <li key={item.additional_service_id} className="flex justify-between">
                  <span>{item.additional_service_name}</span>
                  <span className="text-xs">(${item.additional_service_price})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No additional services</p>
          )}
        </div>

        <Separator />

        {/* Date & Time */}
        <div className="space-y-2">
          <h3 className="font-medium">Scheduled Date & Time</h3>
          <div className="grid gap-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{bookingDate && format(bookingDate, "EEEE, MMMM d, yyyy")}</span>
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
                <p className="text-xs">
                  {checkout?.city}, {checkout?.district}
                </p>
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
