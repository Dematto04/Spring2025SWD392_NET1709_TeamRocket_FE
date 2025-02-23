import React, { useContext } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Separator } from "../ui/separator";
import AdditionalService from "./AdditionalService";
import ServiceDateTime from "./ServiceDateTime";
import Profile from "../CustomerProfile/Profile";
import ServiceBookingPersonal from "./ServiceBookingPersonal";
import { ServiceBookContext } from "./ServiceBookContext";
import { bookingSteps } from "./ServiceBookingSidebar";
import { useNavigate } from "react-router-dom";
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
  const nav = useNavigate()
  const handNextStep = async () => {
    if (step === 2) {
      const isValid = await form.trigger();
      if (!isValid) return;
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
        {step === bookingSteps.length - 1 && <Button onClick={()=> nav('/service/checkout')}>Place Order</Button>}
      </div>
    </div>
  );
}

export default ServiceBook;
