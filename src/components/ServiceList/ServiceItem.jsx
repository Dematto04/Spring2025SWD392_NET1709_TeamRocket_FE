import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Heart, MapPin, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
function ServiceItem({service}) {
  return (
    <div className="max-w-80 rounded-lg overflow-hidden shadow-md">
      <Card>
        <CardHeader className="p-0 relative">
          <Link to={`/service/${service.id}`}>
            <img src="/home-cleaning.webp" alt="" />
          </Link>
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 p-2 bg-[rgba(255,255,255,0.85)] text-slate-800 hover:bg-[rgba(255,255,255,0.85)]"
          >
            Home service
          </Badge>
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 p-2 bg-[rgba(255,255,255,0.85)] text-slate-800 cursor-pointer hover:bg-primary hover:text-white"
          >
            <Heart size={14} />
          </Badge>
        </CardHeader>
        <CardContent className="md:p-3 xl:px-6 text-xl font-medium">
          <Link to={`/service/${service.id}`}>
            <h3 className="hover:text-primary duration-200">
              {service.name}
            </h3>
          </Link>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <div className="text-sm font-normal">{service.location}</div>
            </div>
            <div className="flex gap-1 items-center">
              <Star size={14} color="#ffc107" fill="#ffc107" />
              <span className="text-sm font-normal">{service.overallRating}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="md:p-3 xl:p-6">
          <div className="flex w-full justify-between">
            <div className="flex items-end gap-2">
              <h3 className="text-xl font-medium">$ {service.price}</h3>
            </div>
            <Link to={`/service/123`}>
              <Button className="text-primary bg-[rgba(37,99,235,0.1)] hover:text-white">
                Book now
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ServiceItem;
