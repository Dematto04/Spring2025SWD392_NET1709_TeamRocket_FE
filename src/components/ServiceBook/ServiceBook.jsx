import React, { useContext } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Separator } from "../ui/separator";
import AdditionalService from "./AdditionalService";
import ServiceDateTime from "./ServiceDateTime";
import Profile from "../CustomerProfile/Profile";
import ServiceBookingPersonal from "./ServiceBookingPersonal";
import { ServiceBookContext } from "./ServiceBookContext";
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
  const handNextStep = () => {
    if(step === 2){
      form.trigger()
      return
    }
    setStep(step + 1);
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
        {step < 3 && (
          <Button onClick={handNextStep}>
            Next
            <ArrowRight />
          </Button>
        )}
        {step === 3 && <Button>Place Order</Button>}
      </div>
    </div>
  );
}

export default ServiceBook;
