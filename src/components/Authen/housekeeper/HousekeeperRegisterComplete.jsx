import React from "react";
import { useSelector } from "react-redux";
import {
  selectEmail,
  selectRegisterProfile,
} from "@/redux/features/housekeeperRegisterSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useGetCategoriesQuery } from "@/redux/api/serviceApi";


export default function HousekeeperRegisterComplete() {
  const profile = useSelector(selectRegisterProfile);
  const {
    fullName,
    dob,
    phone,
    address_line,
    services,
    location,
    city,
    district,
  } = profile || {};
  const email = useSelector(selectEmail);
  const { data, isSuccess } = useGetCategoriesQuery();

  return (
    <Card className="max-w-xl w-full rounded-xl mx-auto mt-8 border-none shadow-md p-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Registration Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <InfoItem label="Email" value={email} />
          <InfoItem label="Full Name" value={fullName} />
          <InfoItem label="Date of Birth" value={dob} />
          <InfoItem label="Phone Number" value={phone} />
          <InfoItem label="Address" value={address_line} />
        </div>
        <div className="mt-6">
          <p className="font-medium">Selected Services</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {services?.length ? (
              services.map((service) => (
                <Badge key={service}>
                  {data?.data?.find((item) => item.id === service)?.name}
                </Badge>
              ))
            ) : (
              <p className="">No services selected</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="border-b pb-2">
      <p className="font-medium">{label}</p>
      <p className="">{value || "Not provided"}</p>
    </div>
  );
}

function formatCurrency(value) {
  return value
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value)
    : "Not specified";
}

function formatWorkingTime(value) {
  const options = {
    fulltime: "Full-time",
    parttime: "Part-time",
    flexible: "Flexible",
  };
  return options[value] || "Not specified";
}
