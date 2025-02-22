import ServiceBook from "@/components/ServiceBook/ServiceBook";
import ServiceBookingSidebar from "@/components/ServiceBook/ServiceBookingSidebar";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

function ServiceBookingPage() {
  const [step, setStep] = useState(0)
  return (
    <div className="w-full min-h-screen bg-secondary mb-48">
      <div className="container mx-auto px-6 lg:px-16 h-full py-40">
        <div className="w-full bg-background flex items-start p-4 rounded-xl gap-6">
          <ServiceBookingSidebar step={step}/>
          <ServiceBook setStep={setStep} step={step}/>
        </div>
      </div>
    </div>
  );
}

export default ServiceBookingPage;
