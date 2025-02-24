import React from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck2, Heart, MapPin, Star } from "lucide-react";
function ServiceDetailHeader({detail}) {
  return (
    <>
      <div>
        <div className="flex justify-between flex-wrap gap-y-2 md:flex-nowrap items-end">
          <h1 className="text-3xl font-medium">{detail.name}</h1>
          <div className="">
            <Badge>
              <CalendarCheck2 />
              <span>{detail.numOfBooks} Bookings</span>
            </Badge>
          </div>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-y-2 md:flex-nowrap">
          <div className="mt-2 flex gap-2 items-center">
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <div className="text-sm font-normal">{detail.location}</div>
            </div>
            <div className="flex gap-1 items-center">
              <Star size={14} color="#ffc107" fill="#ffc107" />
              <span className="text-sm font-normal">{detail.reviews} ({detail.numOfReviews} reviews)</span>
            </div>
          </div>
          <div className="mt-2 flex text-sm font-normal items-center hover:text-primary cursor-pointer">
            <Heart size={14} />
            <div>Add to wishlist</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceDetailHeader;
