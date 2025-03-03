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
import { formatSchedule } from "@/lib/utils";

export default function CheckoutItems({address, additionalService, service, user, additionalPrice, timeSlot}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Booking Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Booking Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                {service?.name}
                {/* Additional Services */}
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                 {additionalService && additionalService.map((item)=> (
                  <div key={item.name}>-{item.name}</div>
                 ))}
                </div>
              </TableCell>
              <TableCell>
                <img
                  src="/home-cleaning.webp"
                  alt="Home Cleaning"
                  className="object-cover w-12 h-12 rounded-md"
                  width="50"
                  height="50"
                />
              </TableCell>
              <TableCell>${additionalPrice}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Separator />

        {/* Date & Time */}
        <div className="text-sm">
          <p className="font-medium">Scheduled Date & Time:</p>
          <p className="text-gray-500">{formatSchedule(timeSlot?.startDate)}</p>
        </div>

        <Separator />

        {/* Billing Address */}
        <div className="text-sm space-y-1">
          <p className="font-medium">Billing Address:</p>
          <p>{address.address_line}</p>
          <p>📞 {user?.phoneNumber || "0394388330"}</p>
          <p>📧 {user?.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}
