import CheckoutItems from "@/components/Checkout/CheckoutItems";
import { CheckoutSummary } from "@/components/Checkout/CheckoutSummary";
import LoadingScreen from "@/components/Loading";
import { toast } from "@/hooks/use-toast";
import {
  useGetServiceCheckoutDetailMutation,
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
import { Navigate } from "react-router-dom";

function CheckoutPage() {
  const address = useSelector(selectAddress);
  console.log({address});
  
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
        additional_services: additionalService?.map((item) => {
          return {
            additional_service_id: item.id,
          };
        }),
      });

      if (result.error) {
        toast({
          title: "Cannot get checkout detail",
          variant: "destructive",
        });
        return;
      }
      setCheckout(result.data.data);
      console.log({ checotui: result.data.data });
    };
    fn();
  }, [timeSlot?.id, address?.addressId, service?.id, additionalService]);

  const handlePlaceOrder = async () => {
    const result = await placeOrder(
      {
        startDate: new Date(),
        timeSlotId: checkout?.time_slot_id,
        addressId: address?.addressId,
        serviceId: checkout?.service_id,
        bookingAdditionalIds: checkout.additional_services?.map((item) => item.addtional_service_id),
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
  if (isLoading || !checkout) return <LoadingScreen />;
  if (isError) {
    toast({
      title: "Something when wrong",
      description: "Cannot get checkout information",
      variant: "destructive",
    });
  }
  return (
    <div className="w-full min-h-screen bg-secondary mb-48">
      {checkout.status !== "Pending" && <Navigate to={"/"} />}
      <div className="container mx-auto px-6 lg:px-16 h-full py-40">
        <div className="w-full bg-background p-4 rounded-xl">
          <h1 className="text-xl leading-none tracking-tight font-semibold">
            Checkout
          </h1>
          <div className="flex flex-col md:flex-row gap-6 md:p-6">
            <div className="md:w-2/3">
              <CheckoutItems
                address={checkout?.address}
                additionalService={checkout?.additional_services}
                service={service}
                user={user}
                additionalPrice={checkout && checkout?.addtional_price}
                timeSlot={{
                  start_time: checkout.start_time,
                  end_time: checkout.end_time,
                }}
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
