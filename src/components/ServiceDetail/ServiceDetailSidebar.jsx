import React from "react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import {
  Calendar,
  Mail,
  MailIcon,
  MapPin,
  Phone,
  Star,
  User,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { serviceBooking } from "@/redux/features/bookingSlice";

function ServiceDetailSidebar({service, housekeeper}) {
  const dispatch = useDispatch()
  return (
    <>
      <div className="">
        <div>Starts from</div>
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-end gap-1">
            <h1 className="text-4xl font-bold ">${service?.price}</h1>
            {/* <s className="font-bold text-gray-500">$875</s> */}
          </div>
          {/* <Badge className="bg-green-500 hover:bg-green-500">50% offer</Badge> */}
        </div>
        <Separator />
        <div>
          <Link
            to={`/service/booking/${service?.id}`}
            className="flex gap-2 items-center text-lg"
          >
            <Button className="mt-8 w-full py-6">
              <Calendar />
              <span>Book service</span>
            </Button>
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-semibold mt-8">Housekeeper info</h1>
          {/* housekeeper personal info */}
          <div className="w-full mt-8 py-6 bg-secondary flex flex-col items-center justify-center rounded-lg">
            <div>
              <img src={housekeeper?.avatar} className="w-20 h-20 rounded-full" />
            </div>
            <div className="text-lg font-medium mt-4">{housekeeper?.name}</div>
            <div>
              <div className="flex gap-1 items-center">
                <Star size={14} color="#ffc107" fill="#ffc107" />
                <span className="text-sm font-normal">{housekeeper?.review}</span>
              </div>
            </div>
          </div>
          {/* housekeeper contact info */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Address</span>
              </div>
              <div className="w-48 text-end ">{housekeeper?.address}</div>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <MailIcon size={16} />
                <span>Email</span>
              </div>
              <div>{housekeeper?.email}</div>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>Phone</span>
              </div>
              <div>{housekeeper?.mobile}</div>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
      </div>
    </>
  );
}

export default ServiceDetailSidebar;
