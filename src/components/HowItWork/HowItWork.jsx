import React from "react";
import Header1 from "../Typo/Header1";
import Paragraph from "../Typo/Paragraph";
import { CalendarCheck, MousePointerClick, UserSearch } from "lucide-react";

function HowItWork() {
  return (
    <section className="w-full bg-[url('/how-it-work.png')] bg-no-repeat bg-[105%_90%] min-h-[70vh]">
      <div className="px-3 py-8 lg:px-16 lg:py-20">
        <Header1 className="text-center">How it works</Header1>
        <Paragraph className="text-center">
          Book a housekeeper in just three simple steps.
        </Paragraph>
        <div className="flex justify-between items-start flex-wrap md:flex-nowrap gap-4 md:gap-2 lg:gap-20 xl:gap-44 mt-8">
          {[
            { icon: MousePointerClick, title: "Choose a service", text: "Pick a cleaning service that suits your needs." },
            { icon: UserSearch, title: "Select a housekeeper", text: "Browse and choose a trusted professional." },
            { icon: CalendarCheck, title: "Confirm booking", text: "Schedule a time, and we’ll handle the rest." }
          ].map((step, index) => (
            <div key={index} className="w-full bg-background relative lg:w-1/3 p-8 rounded-xl shadow-xl border border-1 flex items-center justify-center flex-col h-full duration-500 hover:-translate-y-3">
              <div className="absolute -top-5 left-3 text-4xl font-bold text-primary opacity-80">
                0{index + 1}
              </div>
              <div className="bg-secondary flex justify-center h-20 w-20 items-center rounded-2xl">
                <step.icon className="text-primary size-10" />
              </div>
              <p className="font-semibold text-xl text-center">{step.title}</p>
              <p className="text-center mt-2">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWork;
