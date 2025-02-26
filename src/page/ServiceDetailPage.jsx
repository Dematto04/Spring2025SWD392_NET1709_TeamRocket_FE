import React from "react";

import ServiceDetailHeader from "@/components/ServiceDetail/ServiceDetailHeader";
import ServiceDetailHero from "@/components/ServiceDetail/ServiceDetailHero";
import ServiceDetailCarousel from "@/components/ServiceDetail/ServiceDetailCarousel";
import ServiceDetailSidebar from "@/components/ServiceDetail/ServiceDetailSidebar";
import ServiceDetailOverview from "@/components/ServiceDetail/ServiceDetailOverview";
import FAQ from "@/components/Home/FAQ/FAQ";
import ServiceDetailReview from "@/components/ServiceDetail/ServiceDetailReview";
import { useGetServicesDetailQuery } from "@/redux/api/serviceApi";
import { useParams } from "react-router-dom";
function ServiceDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetServicesDetailQuery(id);
  console.log({ service: data });

  if (isLoading) return null;
  return (
    <>
      {/* service hero  */}
      <ServiceDetailHero />
      <div className="flex items-center w-full justify-center">
        <div className="container grid grid-cols-12 px-4 lg:mx-16 lg:mb-24">
          <div className="col-span-12 lg:col-span-8 mt-20">
            {/* service header */}
            <ServiceDetailHeader detail={data.data} />
            {/* service carousel */}
            <ServiceDetailCarousel images={data.data.images} />
            <ServiceDetailOverview
              overview={data.data.overview}
              additionalServices={data.data.additionalServices}
            />
            {/* <FAQ
              headerStyle={"text-start mx-0 space-y-6"}
              contentStyle=""
              cardDisplay={false}
              headerText={"text-2xl font-medium mt-8"}
              containerStyle={"mt-16"}
            /> */}
            {/* <ServiceDetailReview numOfReviews={data.data.numOfReviews} reviews={data.data.reviews}/> */}
          </div>
          <div className="hidden lg:block lg:col-span-4 mt-20 ml-8">
            {/* service sidebar */}
            <ServiceDetailSidebar
              service={data.data}
              housekeeper={data.data.housekeeper}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceDetailPage;
