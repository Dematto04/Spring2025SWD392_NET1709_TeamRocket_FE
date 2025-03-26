import React from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck2, Heart, MapPin, Star, StepBack, Clock, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function RequestDetailHeader({ detail }) {
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <Link to={'/dashboard/staff/requests'} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft size={20} /> <span className="text-lg">Back to Requests</span>
      </Link>
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between flex-wrap gap-y-2 md:flex-nowrap items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">{detail.service_name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={16} />
              <span>Created on {new Date(detail.created_time).toLocaleDateString()}</span>
            </div>
          </div>
          <Badge className="text-sm px-4 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200">
            {detail.category_name}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-4 items-center text-sm">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-muted-foreground" />
            <div className="text-muted-foreground">
              {detail.service_address}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <div className="text-muted-foreground">
              {detail.duration} {detail.duration === 1 ? 'hour' : 'hours'}
            </div>
          </div>
        </div>

        {/* Service Status */}
        <div className="flex items-center gap-2">
          <Badge 
            className={`text-sm ${getStatusBadgeClasses(detail.service_status)}`}
          >
            {detail.service_status}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default RequestDetailHeader;