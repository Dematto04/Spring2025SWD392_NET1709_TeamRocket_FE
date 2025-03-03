import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "../ui/label";

export const CheckoutSummary = ({ summary, handlePlaceOrder }) => {
  
  return (
    <div className="flex flex-col gap-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <div>Service price</div>
            <div>${summary?.serviceBasePrice}</div>
          </div>
          <div className="flex justify-between mb-4">
            <div>Additional service price</div>
            <div>${summary?.addidionalPrice}</div>
          </div>
          <div className="flex justify-between mb-4">
            <div>Distance price</div>
            <div>${summary?.distancePrice}</div>
          </div>
          <div className="flex justify-between font-bold">
            <div>Total</div>
            <div>${summary?.totalPrice}</div>
          </div>
          <div className="mt-4">
            <Label htmlFor="payment">Payment Method</Label>
            <div className="mt-4"></div>
            <Select id="payment">
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {summary?.paymentMethods &&
                  summary?.paymentMethods.map((item) => (
                    <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-red-600 leading-none tracking-tight font-medium mt-2">
              * Please choose payment method
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={handlePlaceOrder} className="w-full">Place Order</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
