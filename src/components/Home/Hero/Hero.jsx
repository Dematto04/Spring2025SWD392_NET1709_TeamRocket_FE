import { Sparkles } from "lucide-react";
import "./hero.css";
import Paragraph from "@/components/Typo/Paragraph";
function Hero() {
  return (
    <div className="relative bg-background min-h-[calc(100vh-5rem)] flex lg:flex justify-between items-center md:mt-20">
      <div className="absolute top-0 left-0 bg-[url(/bg-banner.png)] h-1/3 w-[101px] bg-contain bg-no-repeat"></div>
      <div className="absolute bottom-0 left-0 bg-[url(/bg-banner.png)] h-1/3 w-[101px] bg-contain bg-no-repeat"></div>
      <div className="md:flex-shrink-0 lg:flex-shrink lg:text-start md:p-3 px-3 lg:mx-16 lg:mb-24">
        <div className="flex items-center gap-4 font-medium lg:pb-5">
          <div>Ultimate Cleaning Solution</div>
          <Sparkles size={40} color="#fba311" />
        </div>
        <h1 className="text-3xl lg:text-5xl font-bold relative z-[2]">Hassle-Free Home Cleaning</h1>
        <h1 className="text-3xl lg:text-5xl font-bold">
          at <span className="text-primary">Your Fingertips</span>
        </h1>
        <Paragraph className="lg:text-xl mt-3 text-gray-500">
          Book a professional cleaner in just a few taps.
        </Paragraph>
        <Paragraph className="lg:text-xl text-gray-500">
          Sit back and relax while we take care of your home.
        </Paragraph>
      </div>
      <div className="hidden md:pl-14 md:grid grid-cols-3 lg:px-3 lg:mx-16 lg:mb-36">
        <div className="md:w-24 md:h-24 lg:w-40 lg:h-40 col-span-1 self-center">
          <img
            src="hero-1.webp"
            className="banner-1 rounded-full w-full h-full object-cover shadow-slate-600 shadow-2xl"
            alt=""
          />
        </div>
        <div className="md:w-40 md:h-40 lg:w-64 lg:h-64 -ml-4 col-span-2 ">
          <img
            src="hero-2.webp"
            className="banner-2 rounded-full w-full h-full object-cover shadow-slate-600 shadow-2xl"
            alt=""
          />
        </div>
        <div className="banner-3 relative md:w-36 md:h-36 lg:w-56 lg:h-56 -ml-10 -mt-8 col-span-2">
          <img
            src="hero-3.webp"
            className="rounded-full w-full h-full object-cover shadow-slate-600 shadow-2xl"
            alt=""
          />
          <img className="absolute md:top-6 lg:top-2 -left-28 -z-[2]" src="banner-arrow.svg" alt="arrow" />
        </div>
        <div className="lg:w-32 lg:h-32 md:w-24 md:h-24 col-span-1">
          <img
            src="hero-4.webp"
            className="banner-4 rounded-full w-full h-full object-cover shadow-slate-600 shadow-2xl"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
