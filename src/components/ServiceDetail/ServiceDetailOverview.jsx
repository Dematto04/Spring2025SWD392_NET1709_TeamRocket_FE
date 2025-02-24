import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
function ServiceDetailOverview() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-medium mt-8">Service Overview</h1>
        <p className="mt-4">
          Provides reliable and professional electrical solutions for
          residential and commercial clients. Our licensed electricians are
          dedicated to delivering top-quality service, ensuring safety, and
          meeting all your electrical needs. Committed to providing high-quality
          electrical solutions with a focus on safety and customer satisfaction.
          Our team of licensed electricians is equipped to handle both
          residential and commercial projects with expertise and care.
        </p>
      </div>
      <div>
        <div className="mt-4">
          {/* Service card  */}
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <h1 className="text-2xl font-medium mt-8">Services Offered</h1>
              </AccordionTrigger>
              <AccordionContent>
                {Array(6)
                  .fill(0)
                  .map((item, i) => (
                    <div
                      key={i}
                      className="min-h-40 md:h-40 shadow-lg rounded-lg md:p-6 mt-4 hover:-translate-y-2 duration-500"
                    >
                      <div className="h-full flex gap-4 flex-wrap md:flex-nowrap">
                        <div className="md:shrink-0">
                          <img
                            src="/home-cleaning.webp"
                            className="h-full object-contain rounded-lg"
                          />
                        </div>
                        <div className="flex flex-col justify-between flex-grow">
                          <div>
                            <h2 className="text-xl font-medium">
                              Home Cleaning
                            </h2>
                            <p className="font-medium text-gray-500">
                              Fixing faulty wiring, outlets, switches, and more
                              to ensure.
                            </p>
                          </div>
                          <div className="flex flex-col items-end justify-end">
                            <span className="text-lg text-primary font-medium">
                              $33.00
                            </span>
                            <span className="font-medium text-gray-500">
                              Estimate: 1 hr
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
}

export default ServiceDetailOverview;
