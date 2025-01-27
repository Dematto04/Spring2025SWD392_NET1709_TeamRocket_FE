import { Sparkles } from "lucide-react";

function Hero() {
  return (
    <div className="relative bg-background min-h-[calc(100vh-5rem)] flex items-center justify-center md:justify-between">
      <div className="absolute top-0 left-0 bg-[url(/bg-banner.png)] h-1/3 w-[101px] bg-contain bg-no-repeat"></div>
      <div className="absolute bottom-0 left-0 bg-[url(/bg-banner.png)] h-1/3 w-[101px] bg-contain bg-no-repeat"></div>
      <div className="text-start lg:px-3 lg:mx-16 lg:mb-24">
        <div className="flex items-center gap-4 font-medium lg:pb-5">
          <div>Ultimate Cleaning Solution</div> 
          <Sparkles size={40} color="#fba311"/>
        </div>
        <h1 className="lg:text-5xl font-bold">Hassle-Free Home Cleaning</h1>
        <h1 className="lg:text-5xl font-bold">
          at <span className="text-primary">Your Fingertips</span>
        </h1>
        <p className="lg:text-xl mt-3 text-gray-500">
          Book a professional cleaner in just a few taps.
        </p>
        <p className="lg:text-xl text-gray-500">
          Sit back and relax while we take care of your home.
        </p>
      </div>
      <div className="relative">
        <div className="w-36 h-36">
          <img src="hero-1.jpg" className="rounded-full w-full h-full object-cover"  alt="" />
        </div>
      </div>
    </div>
  );
}

export default Hero;
