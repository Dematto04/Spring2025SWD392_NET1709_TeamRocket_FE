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
            <h1 className="text-4xl font-bold ">{service?.price}</h1>
            {/* <s className="font-bold text-gray-500">$875</s> */}
          </div>
          {/* <Badge className="bg-green-500 hover:bg-green-500">50% offer</Badge> */}
        </div>
        <Separator />
        <div>
          <Link
            to={`/service/booking/${service.id}`}
            className="flex gap-2 items-center text-lg"
            onClick={()=> {
              dispatch(serviceBooking(service))
            }}
          >
            <Button className="mt-8 w-full py-6">
              <Calendar />
              <span>Book service</span>
            </Button>
          </Link>

          <Button variant="outline" className="mt-4 w-full py-6">
            <Link className="flex gap-2 items-center text-lg">
              <Mail />
              <span>Send Enquiry</span>
            </Link>
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-semibold mt-8">Housekeeper info</h1>
          {/* housekeeper personal info */}
          <div className="w-full mt-8 py-6 bg-secondary flex flex-col items-center justify-center rounded-lg">
            <div>
              <img src={housekeeper.avatar} className="w-20 h-20 rounded-full" />
            </div>
            <div className="text-lg font-medium mt-4">{housekeeper.name}</div>
            <div>
              <div className="flex gap-1 items-center">
                <Star size={14} color="#ffc107" fill="#ffc107" />
                <span className="text-sm font-normal">4.9 (255 reviews)</span>
              </div>
            </div>
          </div>
          {/* housekeeper contact info */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>Member since</span>
              </div>
              <div>{housekeeper.memberSince}</div>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Address</span>
              </div>
              <div>{housekeeper.address}</div>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <MailIcon size={16} />
                <span>Email</span>
              </div>
              <div>{housekeeper.email}</div>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>Phone</span>
              </div>
              <div>+123 456 7890</div>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        {/* Bussiness hour */}
        {/* <div>
          <h1 className="text-3xl font-semibold">Bussiness hours</h1>
          <div className="mt-4 space-y-2">
            {[
              { day: "Monday", hours: "9:30 AM - 7:00 PM" },
              { day: "Tuesday", hours: "9:30 AM - 7:00 PM" },
              { day: "Wednesday", hours: "9:30 AM - 7:00 PM" },
              { day: "Thursday", hours: "9:30 AM - 7:00 PM" },
              { day: "Friday", hours: "9:30 AM - 7:00 PM" },
              { day: "Saturday", hours: "10:00 AM - 5:00 PM" },
              { day: "Sunday", hours: "Closed" },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>{item.day}</div>
                <div>{item.hours}</div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </>
  );
}

export default ServiceDetailSidebar;
