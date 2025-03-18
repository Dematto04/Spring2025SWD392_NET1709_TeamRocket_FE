import React from "react";

import ServiceDetailHeader from "@/components/ServiceDetail/ServiceDetailHeader";
import ServiceDetailHero from "@/components/ServiceDetail/ServiceDetailHero";
import ServiceDetailCarousel from "@/components/ServiceDetail/ServiceDetailCarousel";
import ServiceDetailSidebar from "@/components/ServiceDetail/ServiceDetailSidebar";
import ServiceDetailOverview from "@/components/ServiceDetail/ServiceDetailOverview";
import ServiceDetailRating from "@/components/ServiceDetail/ServiceDetailRating";
import { useGetServicesDetailQuery } from "@/redux/api/serviceApi";
import { useParams } from "react-router-dom";
import LoadingScreen from "@/components/Loading";
import ServiceDetailSteps from "@/components/ServiceDetail/ServiceDetailSteps";
function ServiceDetailPage() {
  const { id } = useParams();
  const { data, isLoading, isError, isSuccess } = useGetServicesDetailQuery(id);


  if (isLoading) return <LoadingScreen />;

  return (
    isSuccess && (
      <>
        <ServiceDetailHero />
        <div className="flex items-center w-full justify-center">
          <div className="container grid grid-cols-12 px-4 lg:mx-16 lg:mb-24">
            <div className="col-span-12 lg:col-span-8 mt-20">
              {/* service header */}
              <ServiceDetailHeader detail={data?.data} />
              {/* service carousel */}
              <ServiceDetailCarousel
                images={
                  data?.data.images && data?.data.images.map((img) => img.url)
                }
              />
              <ServiceDetailOverview
                overview={data?.data.overview}
                additionalServices={data?.data.additionalServices}
              />
              <ServiceDetailSteps data={data} />
              <ServiceDetailRating serviceId={id} />
            </div>
            <div className="hidden lg:block lg:col-span-4 mt-20 ml-8">
              {/* service sidebar */}
              <ServiceDetailSidebar
                service={data?.data}
                housekeeper={data?.data.housekeeper}
              />
            </div>
          </div>
        </div>
      </>
    )
  );
}

export default ServiceDetailPage;
