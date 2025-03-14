import React, { useContext, useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Separator } from "../ui/separator";
import AdditionalService from "./AdditionalService";
import ServiceDateTime from "./ServiceDateTime";
import ServiceBookingPersonal from "./ServiceBookingPersonal";
import { ServiceBookContext } from "./ServiceBookContext";
import { bookingSteps } from "./ServiceBookingSidebar";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, serviceBooking } from "@/redux/features/bookingSlice";
const Content = ({ step }) => {
  switch (step) {
    case 0:
      return <AdditionalService />;
    case 1:
      return <ServiceDateTime />;
    case 2:
      return <ServiceBookingPersonal />;
  }
};
function ServiceBook({ step, setStep }) {
  const { form } = useContext(ServiceBookContext);
  const nav = useNavigate();
  const timeSlot = useSelector((state) => state.booking.timeSlot);
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(
      serviceBooking({
        serviceId: id,
      })
    );
  }, []);
  const handNextStep = async () => {
    
    if (step === 1) {
      if (!timeSlot) {
        toast({
          title: "Lack of information",
          description: "Please choose a time slot",
          variant: "destructive",
          duration: 1000,
        });
        return;
      }
    }
    //Thêm address vào redux
    if (step === 2) {
      const isValid = await form.trigger();
      if (!isValid) return;
      const body = {
        id: form.getValues("addressId"),
        address: form.getValues("address_line"),
        city: form.getValues("city"),
        district: form.getValues("district"),
        placeId: form.getValues("place_id"),
        isDefault: false,
        title: "Home",
      };
      console.log({ body });
      dispatch(
        addAddress({
          addressId: form.getValues("addressId"),
          address: form.getValues("address_line"),
          city: form.getValues("city"),
          district: form.getValues("district"),
          placeId: form.getValues("place_id"),
          isDefault: false,
          title: "Home",
        })
      );

      nav("/service/checkout");
    }
    setStep((prev) => prev + 1);
  };
  return (
    <div className="flex-1 h-full p-4 rounded-lg">
      <Content step={step} />
      <Separator className="mt-16 mb-8" />
      <div className="flex justify-end gap-4">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            <ArrowLeft />
            Prev
          </Button>
        )}
        {step < bookingSteps.length - 1 && (
          <Button onClick={handNextStep}>
            Next
            <ArrowRight />
          </Button>
        )}
        {step === bookingSteps.length - 1 && (
          <Button onClick={handNextStep}>Place Order</Button>
        )}
      </div>
    </div>
  );
}

export default ServiceBook;
