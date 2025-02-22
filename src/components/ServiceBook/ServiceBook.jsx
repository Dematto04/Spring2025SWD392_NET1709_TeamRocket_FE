import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Separator } from "../ui/separator";

function ServiceBook({ step, setStep }) {
  return (
    <div className="flex-1 h-full p-4 rounded-lg">
      <h1 className="font-semibold leading-none tracking-tight">
        Select Additional Service
      </h1>
      <div className="grid grid-cols-2 gap-2">
        {Array(5)
          .fill(1)
          .map(() => (
            <div className="col-span-1 h-36 shadow-lg rounded-lg md:p-6 mt-4 duration-500">
              <div className="h-full flex gap-4 flex-wrap md:flex-nowrap">
                <div className="md:shrink-0">
                  <img
                    src="/home-cleaning.webp"
                    className="h-full object-contain rounded-lg"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="font-medium">Home Cleaning</h2>
                    <p className="font-medium text-sm text-gray-500">
                      Fixing faulty wiring, outlets, switches, and more to
                      ensure.
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-primary font-medium">
                      $33.00/hr
                    </span>
                    <Button variant="outline">Add</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <Separator className="mt-16 mb-8" />
      <div className="flex justify-end gap-4">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            <ArrowLeft />
            Prev
          </Button>
        )}
        {step < 3 && (
          <Button onClick={() => setStep(step + 1)}>
            Next
            <ArrowRight />
          </Button>
        )}
        {step === 3 && (
          <Button >Place Order</Button>
        )}
      </div>
    </div>
  );
}

export default ServiceBook;
