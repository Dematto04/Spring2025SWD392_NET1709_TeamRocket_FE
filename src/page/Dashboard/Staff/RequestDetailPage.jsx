import React from "react";
import RequestDetailHeader from "@/components/RequestDetail/RequestDetailHeader";
import RequestDetailCarousel from "@/components/RequestDetail/RequestDetailCarousel";
import RequestDetailOverview from "@/components/RequestDetail/RequestDetailOverview";
import RequestDetailSidebar from "@/components/RequestDetail/RequestDetailSidebar";
import { useGetPendingRequestDetailQuery } from "@/redux/api/requestApi";
import { useParams } from "react-router-dom";

function RequestDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetPendingRequestDetailQuery(id);


  if (isLoading) return null;
  return (
    <div className="flex items-center w-full justify-center">
      <div className="container grid grid-cols-12 px-4 lg:mx-16 lg:mb-24">
        <div className="col-span-12 lg:col-span-8 mt-20">
          {/* Service Header */}
          <RequestDetailHeader detail={data.data} />
          {/* Service Carousel */}
          <RequestDetailCarousel
            images={data.data.serviceImages.map(img => img.link)}
            categoryPictureUrl={data.data.category_picture_url}
          />
          {/* Service Overview */}
          <RequestDetailOverview
            overview={data.data.service_description}
            additionalServices={data.data.additionalServices}
            duration={data.data.duration}
            serviceTimeSlots={data.data.serviceTimeSlots}
          />
        </div>
        <div className="hidden lg:block lg:col-span-4 mt-20 ml-8">
          {/* Service Sidebar */}
          <RequestDetailSidebar
            service={data.data}
            housekeeper={{ name: data.data.user_name }}
          />
        </div>
      </div>
    </div>
  );
}

export default RequestDetailPage;