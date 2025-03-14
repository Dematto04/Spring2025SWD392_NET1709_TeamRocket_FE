import CheckoutItems from "@/components/Checkout/CheckoutItems";
import { CheckoutSummary } from "@/components/Checkout/CheckoutSummary";
import { toast } from "@/hooks/use-toast";
import {
  useGetServiceCheckoutDetailMutation,
  usePlaceOrderServiceMutation,
} from "@/redux/api/serviceApi";
import { selectUser } from "@/redux/features/authSlice";
import {
  resetBooking,
  selectAdditional,
  selectAddress,
  selectServiceBooking,
  selectServiceBookingTimeSlot,
} from "@/redux/features/bookingSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const CheckoutSkeleton = () => (
  <div className="w-full bg-background p-4 rounded-xl">
    <Skeleton className="h-8 w-32 mb-6" />
    <div className="flex flex-col md:flex-row gap-6 md:p-6">
      <div className="md:w-2/3 space-y-6">
        {/* User Info Skeleton */}
        <Card className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Card>

        {/* Service Info Skeleton */}
        <Card className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-20 w-20" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Card>

        {/* Additional Services Skeleton */}
        <Card className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary Skeleton */}
      <div className="md:w-1/3">
        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
            <Skeleton className="h-[1px] w-full bg-border" />
            <div className="flex justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    </div>
  </div>
);

function CheckoutPage() {
  const dispatch = useDispatch();
  const address = useSelector(selectAddress);
  const additionalService = useSelector(selectAdditional);
  const service = useSelector(selectServiceBooking);
  const user = useSelector(selectUser);
  const timeSlot = useSelector(selectServiceBookingTimeSlot);
  const [getCheckoutDetail, { data, isLoading, isError }] =
    useGetServiceCheckoutDetailMutation();
  const [placeOrder, { isLoading: isPlacing, data: order }] =
    usePlaceOrderServiceMutation();
  const [checkout, setCheckout] = useState();

  useEffect(() => {
    const fn = async () => {
      if (!timeSlot?.id || !address?.addressId || !service?.serviceId) return;

      const result = await getCheckoutDetail({
        timeslot_id: timeSlot?.id,
        address_id: address.addressId,
        service_id: service.serviceId,
        additional_services: additionalService?.map((item) => ({
          additional_service_id: item.id,
        })),
        booking_date: timeSlot.day,
      });

      if (result.error) {
        toast({
          title: "Cannot get checkout detail",
          variant: "destructive",
        });
        return;
      }
      setCheckout(result.data.data);
    };
    fn();
  }, [timeSlot?.id, address?.addressId, service?.id, additionalService]);

  const handlePlaceOrder = async () => {
    const result = await placeOrder(
      {
        startDate: checkout?.booking_date,
        timeSlotId: checkout?.time_slot_id,
        addressId: address?.addressId,
        serviceId: checkout?.service_id,
        bookingAdditionalIds: checkout.additional_services?.map(
          (item) => item.addtional_service_id
        ),
      },
      { paymentMethod: "VNPay" }
    );
    if (result.error) {
      toast({
        title: "Cannot place order",
        description: "Something went wrong",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    dispatch(resetBooking());
    window.open(result.data.url);
  };

  if (isError) {
    toast({
      title: "Something went wrong",
      description: "Cannot get checkout information",
      variant: "destructive",
    });
  }

  return (
    <div className="w-full min-h-screen bg-secondary mb-48">
      {checkout && checkout?.status !== "Pending" && <Navigate to={"/"} />}
      <div className="container mx-auto px-6 lg:px-16 h-full py-40">
        {isLoading || !checkout ? (
          <CheckoutSkeleton />
        ) : (
          <div className="w-full bg-background p-4 rounded-xl">
            <h1 className="text-xl leading-none tracking-tight font-semibold">
              Checkout
            </h1>
            <div className="flex flex-col md:flex-row gap-6 md:p-6">
              <div className="md:w-2/3">
                <CheckoutItems
                 checkout={checkout && checkout}
                />
              </div>
              <div className="md:w-1/3">
                <CheckoutSummary
                  summary={checkout}
                  handlePlaceOrder={handlePlaceOrder}
                  isPlacing={isPlacing}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;
