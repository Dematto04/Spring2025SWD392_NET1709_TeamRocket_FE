import React from "react";
import Header1 from "../Typo/Header1";
import Paragraph from "../Typo/Paragraph";
import { CalendarCheck, MousePointerClick, UserSearch } from "lucide-react";

function HowItWork() {
  return (
    <section className="w-full bg-[url('/how-it-work.png')] bg-no-repeat bg-[105%_90%] min-h-[70vh]">
    <div className="px-3 py-8 lg:px-16 lg:py-20">
      <Header1 className={"text-center"}>How it works</Header1>
      <Paragraph className={"text-center"}>content</Paragraph>
      <div className="flex justify-between items-start flex-wrap  md:flex-nowrap gap-4 md:gap-2 lg:gap-20 xl:gap-44 mt-8">
        <div className="w-full bg-background relative lg:w-1/3 p-8 rounded-xl shadow-xl border border-1 flex items-center justify-center flex-col h-full duration-500 hover:-translate-y-3">
          <div className="absolute -top-5 left-3 text-4xl font-bold text-primary">
            01
          </div>
          <div className="bg-secondary flex justify-center h-20 w-20 items-center rounded-2xl">
            <MousePointerClick className="text-primary size-10" />
          </div>
          <p className="font-semibold text-xl">Choose service</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quorerum ipsum culpa.
          </p>
        </div>
        <div className="w-full bg-background relative lg:w-1/3 p-8 rounded-xl shadow-xl border border-1 flex items-center justify-center flex-col h-full duration-500 hover:-translate-y-3">
          <div className="absolute -top-5 left-3 text-4xl font-bold text-primary">
            02
          </div>
          <div className="bg-secondary flex justify-center h-20 w-20 items-center rounded-2xl">
            <UserSearch className="text-primary size-10" />
          </div>
          <p className="font-semibold text-xl">Select housekeeper</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quorerum ipsum culpa.
          </p>
        </div>
        <div className="w-full bg-background relative lg:w-1/3 p-8 rounded-xl shadow-xl border border-1 flex items-center justify-center flex-col h-full duration-500 hover:-translate-y-3">
          <div className="absolute -top-5 left-3 text-4xl font-bold text-primary">
            03
          </div>
          <div className="bg-secondary flex justify-center h-20 w-20 items-center rounded-2xl">
            <CalendarCheck className="text-primary size-10" />
          </div>
          <p className="font-semibold text-xl">Confirm booking</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quorerum ipsum culpa.
          </p>
        </div>
      </div>
    </div>
  </section>
  );
}

export default HowItWork;
