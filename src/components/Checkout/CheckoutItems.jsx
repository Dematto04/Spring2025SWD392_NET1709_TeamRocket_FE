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
import { Badge } from "@/components/ui/badge";

export default function CheckoutItems() {
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
                Home Cleaning
                {/* Additional Services */}
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p>- Carpet Cleaning</p>
                  <p>- Window Washing</p>
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
              <TableCell>$100.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Separator />

        {/* Date & Time */}
        <div className="text-sm">
          <p className="font-medium">Scheduled Date & Time:</p>
          <p className="text-gray-500">February 25, 2025 - 10:00 AM</p>
        </div>

        <Separator />

        {/* Billing Address */}
        <div className="text-sm space-y-1">
          <p className="font-medium">Billing Address:</p>
          <p>Vinhomes Grand Park, Nguyễn Xiển, Long Thạnh Mỹ, Quận 9</p>
          <p>Bình Dương Province, 123456</p>
          <p>📞 0394388330</p>
          <p>📧 customerdemo@example.com</p>
        </div>
      </CardContent>
    </Card>
  );
}
