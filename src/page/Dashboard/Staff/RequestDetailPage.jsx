import React from "react";

import RequestDetailHeader from "@/components/RequestDetail/RequestDetailHeader";
import RequestDetailCarousel from "@/components/RequestDetail/RequestDetailCarousel";
import RequestDetailOverview from "@/components/RequestDetail/RequestDetailOverview";
import RequestDetailSidebar from "@/components/RequestDetail/RequestDetailSidebar";
import FAQ from "@/components/Home/FAQ/FAQ";
import ServiceDetailReview from "@/components/ServiceDetail/ServiceDetailReview";
import { useGetPendingRequestDetailQuery } from "@/redux/api/requestApi";
import { useParams } from "react-router-dom";
function RequestDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetPendingRequestDetailQuery(id);
  console.log({ service: data });

  if (isLoading) return null;
  return (
    <>
      {/* service hero  */}
      {/* <ServiceDetailHero /> */}
      <div className="flex items-center w-full justify-center">
        <div className="container grid grid-cols-12 px-4 lg:mx-16 lg:mb-24">
          <div className="col-span-12 lg:col-span-8 mt-20">
            {/* service header */}
            <RequestDetailHeader detail={data.data} />
            {/* service carousel */}
            <RequestDetailCarousel images={data.data.serviceImages.map(img => img.link)} />
            <RequestDetailOverview
              overview={data.data.service_description}
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
            <RequestDetailSidebar
              service={data.data}
              housekeeper={{ name: data.data.user_name }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestDetailPage;
