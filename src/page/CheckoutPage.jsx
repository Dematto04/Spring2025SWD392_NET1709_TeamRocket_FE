import CheckoutItems from "@/components/Checkout/CheckoutItems";
import { CheckoutSummary } from "@/components/Checkout/CheckoutSummary";
import { toast } from "@/hooks/use-toast";
import {
  useGetServiceBookingPriceMutation,
  usePlaceOrderServiceMutation,
} from "@/redux/api/serviceApi";
import { selectUser } from "@/redux/features/authSlice";
import {
  selectAdditional,
  selectAddress,
  selectServiceBooking,
  selectServiceBookingTimeSlot,
} from "@/redux/features/bookingSlice";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function CheckoutPage() {
  const address = useSelector(selectAddress);
  const additionalService = useSelector(selectAdditional);
  const service = useSelector(selectServiceBooking);
  const user = useSelector(selectUser);
  const timeSlot = useSelector(selectServiceBookingTimeSlot);
  const [getServicePrice, { data, isLoading, isError }] =
    useGetServiceBookingPriceMutation();
  const [placeOrder, { isLoading: isPlacing, data: order }] =
    usePlaceOrderServiceMutation();
  const [checkout, setCheckout] = useState();
  useEffect(() => {
    const fn = async () => {
      if (!timeSlot?.id || !address?.addressId || !service?.id) return; // Avoid unnecessary API calls

      const result = await getServicePrice({
        timeSlotId: timeSlot?.id,
        addressId: address.addressId,
        serviceId: service?.id,
        bookingAdditionalIds: additionalService?.map((item) => item.id),
      });

      if (result.error) {
        toast({
          title: "Cannot get prices",
          variant: "destructive",
        });
        return;
      }
      setCheckout(result.data.data);
    };
    fn();
  }, [timeSlot?.id, address?.addressId, service?.id, additionalService]); // Only call API when relevant data changes

  const handlePlaceOrder = async () => {
    const result = await placeOrder(
      {
        startDate: timeSlot?.startDate,
        timeSlotId: timeSlot?.id,
        addressId: address.addressId,
        serviceId: service?.id,
        bookingAdditionalIds: additionalService?.map((item) => item.id),
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
    window.open(result.data.url);
    console.log({ result });
  };
  if (isLoading) return null;
  if (isError) {
    toast({
      title: "Something when wrong",
      description: "Cannot get checkout information",
      variant: "destructive",
    });
  }
  return (
    <div className="w-full min-h-screen bg-secondary mb-48">
      <div className="container mx-auto px-6 lg:px-16 h-full py-40">
        <div className="w-full bg-background p-4 rounded-xl">
          <h1 className="text-xl leading-none tracking-tight font-semibold">
            Checkout
          </h1>
          <div className="flex flex-col md:flex-row gap-6 md:p-6">
            <div className="md:w-2/3">
              <CheckoutItems
                address={address}
                additionalService={additionalService}
                service={service}
                user={user}
                additionalPrice={checkout && checkout?.addidionalPrice}
                timeSlot={timeSlot}
              />
            </div>
            <div className="md:w-1/3">
              <CheckoutSummary
                summary={checkout && checkout}
                handlePlaceOrder={handlePlaceOrder}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
