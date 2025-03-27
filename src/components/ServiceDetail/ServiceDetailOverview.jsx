import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
function ServiceDetailOverview({ overview, additionalServices }) {

  return (
    <>
      <div>
        <h1 className="text-2xl font-medium mt-8">Service Overview</h1>
        <p className="mt-4">{overview}</p>
      </div>
      <div>
        <div className="mt-4">
          {/* Service card  */}
          {additionalServices.length > 0 ? (
            <Accordion type="multiple" defaultValue={["item-1"]}>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <h1 className="text-2xl font-medium mt-8">Additional Services</h1>
              </AccordionTrigger>
              <AccordionContent>
                {additionalServices.map((item, i) => (
                  <div
                    key={i}
                    className="min-h-40 md:h-40 shadow-lg rounded-lg md:p-6 mt-4 hover:-translate-y-2 duration-500"
                  >
                    <div className="h-full flex gap-4 flex-wrap md:flex-nowrap">
                      <div className="md:shrink-0">
                        <img
                          src={item?.url}
                          className="h-full object-contain rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-grow">
                        <div>
                          <h2 className="text-xl font-medium">{item?.name}</h2>
                          <div className="text-sm font-medium text-slate-500">{item?.description}</div>
                        </div>
                        <div className="flex flex-col items-end justify-end">
                          <span className="text-lg text-primary font-medium">
                            ${item?.price}
                          </span>
                          <span className="text-lg text-primary font-medium">
                            Estimate: {item?.duration}/min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default ServiceDetailOverview;
