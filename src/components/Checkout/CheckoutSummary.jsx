import React, { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useGetMoneyExchangeQuery } from "@/redux/api/walletApi";

export const CheckoutSummary = ({
  summary,
  handlePlaceOrder,
  isPlacing,
  paymentMethod,
  setPaymentMethod,
}) => {
  const [error, setError] = useState("");
  const { data: moneyExchange, isSuccess } = useGetMoneyExchangeQuery(
    summary?.total_price
  );

  const handleOrder = () => {
    if (!paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    handlePlaceOrder();
  };

  return (
    isSuccess && (
      <div className="flex flex-col gap-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service price</span>
                <span>${summary?.base_service_price}</span>
              </div>
              {summary?.additional_price > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Additional services
                  </span>
                  <span>${summary?.additional_price}</span>
                </div>
              )}
              {summary?.distance_price > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Distance fee</span>
                  <span>${summary?.distance_price}</span>
                </div>
              )}
              <div className="pt-2 border-t">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${summary?.total_price}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-400">
                  <span>Exchange Rate</span>
                  <span>{moneyExchange?.data.toLocaleString()} VND</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="payment">Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(value) => {
                  setPaymentMethod(value);
                  setError("");
                }}
              >
                <SelectTrigger id="payment">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {summary?.payment_methods?.map((method) => (
                    <SelectItem
                      key={method.name}
                      value={method.name}
                      disabled={!method.is_choosable}
                    >
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              onClick={handleOrder}
              disabled={isPlacing}
              className="w-full"
            >
              {isPlacing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  );
};
