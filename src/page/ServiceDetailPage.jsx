import React from "react";

import ServiceDetailHeader from "@/components/ServiceDetail/ServiceDetailHeader";
import ServiceDetailHero from "@/components/ServiceDetail/ServiceDetailHero";
import ServiceDetailCarousel from "@/components/ServiceDetail/ServiceDetailCarousel";
import ServiceDetailSidebar from "@/components/ServiceDetail/ServiceDetailSidebar";
import ServiceDetailOverview from "@/components/ServiceDetail/ServiceDetailOverview";
import FAQ from "@/components/Home/FAQ/FAQ";
import ServiceDetailReview from "@/components/ServiceDetail/ServiceDetailReview";
function ServiceDetailPage() {
  return (
    <>
      {/* service hero  */}
      <ServiceDetailHero />
      <div className="flex items-center w-full justify-center">
        <div className="container grid grid-cols-12 px-4 lg:mx-16 lg:mb-24">
          <div className="col-span-12 lg:col-span-8 mt-20">
            {/* service header */}
            <ServiceDetailHeader />
            {/* service carousel */}
            <ServiceDetailCarousel />
            <ServiceDetailOverview />
            <FAQ
              headerStyle={"text-start mx-0 space-y-6"}
              contentStyle=""
              cardDisplay={false}
              headerText={"text-2xl font-medium mt-8"}
              containerStyle={"mt-16"}
            />
            <ServiceDetailReview />
          </div>
          <div className="hidden lg:block lg:col-span-4 mt-20 ml-8">
            {/* service sidebar */}
            <ServiceDetailSidebar />
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceDetailPage;
