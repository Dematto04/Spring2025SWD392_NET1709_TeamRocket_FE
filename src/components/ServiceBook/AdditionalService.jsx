import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { containerVariants } from "@/lib/utils";
import { useGetAdditionalServicesQuery } from "@/redux/api/serviceApi";
import { Skeleton } from "../ui/skeleton";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdditional,
  serviceBooking,
  toggleAdditional,
} from "@/redux/features/bookingSlice";
import { Card, CardContent } from "../ui/card";
import { AlertCircle } from "lucide-react";
const ServiceSkeleton = () => (
  <div className="col-span-1 h-36 shadow-lg rounded-lg md:p-6 mt-4 duration-500">
    <div className="h-full flex gap-4 flex-wrap md:flex-nowrap">
      <Skeleton className="h-full w-32 rounded-lg" />
      <div className="flex flex-col justify-between w-full">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </div>
    </div>
  </div>
);

function AdditionalService() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const { data, isLoading } = useGetAdditionalServicesQuery({ serviceId: id });
  const checkedItem = useSelector(selectAdditional);
  const handleAdd = (additionalService) => {
    dispatch(toggleAdditional(additionalService));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 duration-200">
        <ServiceSkeleton />
      </div>
    );
  }
  return (
    <>
      <h1 className="font-semibold leading-none tracking-tight">
        Select Additional Service
      </h1>
      <motion.div
        className="grid grid-cols-2 gap-2 duration-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {data?.data?.length > 0 ? (
          data?.data.map((addition, idx) => (
            <div
              key={addition.id}
              className="col-span-1 h-36 shadow-lg rounded-lg md:p-6 mt-4 duration-500"
            >
              <div className="h-full flex gap-4 flex-wrap md:flex-nowrap">
                <div className="md:shrink-0">
                  <img
                    src={
                      addition.url !== "Empty"
                        ? addition.url
                        : "/home-cleaning.webp"
                    }
                    className="h-full min-w-32 object-contain rounded-lg"
                  />
                </div>
                <div className="flex flex-col w-full justify-between">
                  <div>
                    <h2 className="font-medium">{addition.name}</h2>
                    <p className="font-medium w-full text-sm text-gray-500">
                      {addition.description}
                    </p>
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        Estimate: {addition.duration} mins
                      </span>
                      <span className="text-sm text-primary font-medium">
                        ${addition.price}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleAdd(addition)}
                      variant={
                        (checkedItem || []).some(
                          (item) => item.id === addition.id
                        )
                          ? "success"
                          : "outline"
                      }
                    >
                      {(checkedItem || []).some(
                        (item) => item.id === addition.id
                      )
                        ? "Added"
                        : "Add"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 mt-5 flex h-full items-center justify-center">
            <Card className="w-full max-w-md text-center p-6 shadow-md">
              <CardContent className="flex flex-col items-center gap-2">
                <p className="text-lg font-semibold">No Additional Services</p>
                <p className="text-gray-500">
                  This service does not include any extra options at the moment.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </>
  );
}

export default AdditionalService;
