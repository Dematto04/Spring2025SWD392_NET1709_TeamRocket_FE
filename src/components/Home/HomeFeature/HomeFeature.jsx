import React from "react";
import { Link } from "react-router-dom";
import "./homefeature.css";
const ServiceCard = () => {
  return (
    <Link className="service-feat group relative w-full h-44 bg-card p-6 flex justify-center items-center flex-col rounded-2xl overflow-hidden">
      <div className="relative z-[2] rounded-full bg-accent w-24 h-24 flex justify-center items-center">
        <img
          src="/home-cleaning-icon.svg"
          className="pointer-events-none"
          alt=""
        />
      </div>
      <h1 className="service-title mt-2 text-xl z-[2] font-medium group-hover:text-primary-foreground duration-300">
        Home Cleaning
      </h1>
      <div class="feature-overlay">
        <img className="service-img" src="/home-cleaning-feat.webp" />
      </div>
      <div className="absolute rounded-2xl bg-[rgba(0,0,0,0.2)] group-hover:block hidden z-[1] w-full h-full duration-300"></div>
    </Link>
  );
};
function HomeFeature() {
  return (
    <div className="home-feature bg-secondary">
      <div className="px-3 py-8 lg:px-16 lg:py-20">
        <h1 className="text-3xl lg:text-5xl font-semibold">
          Available Services
        </h1>
        <p className="text-xl mt-4 text-gray-500">We only provide pleasure.</p>

        <div className="grid grid-cols-12 gap-8 mt-20">
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ServiceCard />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ServiceCard />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ServiceCard />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ServiceCard />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ServiceCard />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ServiceCard />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ServiceCard />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ServiceCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeFeature;
