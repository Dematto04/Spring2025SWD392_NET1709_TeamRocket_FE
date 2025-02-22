import ServiceBook from "@/components/ServiceBook/ServiceBook";
import ServiceBookProvider, {
  ServiceBookContext,
} from "@/components/ServiceBook/ServiceBookContext";
import ServiceBookingSidebar from "@/components/ServiceBook/ServiceBookingSidebar";
import React, { useContext } from "react";

function ServiceBookingContent() {
  const { step, setStep } = useContext(ServiceBookContext);

  return (
    <div className="w-full bg-background flex-wrap md:flex-nowrap flex items-start p-4 rounded-xl gap-6">
      <ServiceBookingSidebar step={step} />
      <ServiceBook setStep={setStep} step={step} />
    </div>
  );
}

function ServiceBookingPage() {
  return (
    <ServiceBookProvider>
      <div className="w-full min-h-screen bg-secondary mb-48">
        <div className="container mx-auto px-6 lg:px-16 h-full py-40">
          <ServiceBookingContent />
        </div>
      </div>
    </ServiceBookProvider>
  );
}

export default ServiceBookingPage;
