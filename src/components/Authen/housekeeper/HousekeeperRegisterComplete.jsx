import React from "react";
import { useSelector } from "react-redux";
import { selectRegisterProfile } from "@/redux/features/housekeeperRegisterSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function HousekeeperRegisterComplete() {
  const profile = useSelector(selectRegisterProfile);
  const { fullName, dob, phone, address, services, workingTime, salary, avatar } =
    profile || {};

  return (
    <Card className="max-w-xl w-full rounded-xl mx-auto mt-8 border-none shadow-md p-6">
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4" alt={fullName}>
            <AvatarImage src="/public/client-2.webp"/>
        </Avatar>
        <CardTitle className="text-2xl font-bold">Registration Review</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <InfoItem label="Full Name" value={fullName} />
          <InfoItem label="Date of Birth" value={dob} />
          <InfoItem label="Phone Number" value={phone} />
          <InfoItem label="Address" value={address} />
          <InfoItem label="Preferred Working Time" value={formatWorkingTime(workingTime)} />
          <InfoItem label="Expected Salary" value={formatCurrency(salary)} />
        </div>
        <div className="mt-6">
          <p className="font-medium text-gray-700">Selected Services</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {services?.length ? (
              services.map((service) => (
                <Badge key={service}>{service}</Badge>
              ))
            ) : (
              <p className="text-gray-500">No services selected</p>
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
      <p className="font-medium text-gray-700">{label}</p>
      <p className="text-gray-600">{value || "Not provided"}</p>
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