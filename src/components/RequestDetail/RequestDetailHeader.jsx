import React from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck2, Heart, MapPin, Star, StepBack } from "lucide-react";
import { Link } from "react-router-dom";

function RequestDetailHeader({ detail }) {
  return (
    <div>
      <Link to={'/dashboard/staff/requests'} className="flex items-center gap-2 mb-4">
        <StepBack /> <span className="text-lg">Go back</span>
      </Link>
      <div className="flex justify-between flex-wrap gap-y-2 md:flex-nowrap items-end">
        <h1 className="text-3xl font-medium">{detail.service_name}</h1>
        <Badge variant="secondary" className="text-sm">
          {detail.category_name}
        </Badge>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-y-2 md:flex-nowrap">
        <div className="mt-2 flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <div className="text-sm font-normal">
              {detail.service_address}, {detail.service_city}, {detail.service_district}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetailHeader;