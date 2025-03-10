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
        {data?.data.map((addition, idx) => (
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
                    {/* Fixing faulty wiring, outlets, switches, and more to ensure. */}
                  </p>
                </div>
                <div className="flex justify-between w-full items-center">
                  <span className="text-sm text-primary font-medium">
                    ${addition.price}
                  </span>
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
                    {(checkedItem || []).some((item) => item.id === addition.id)
                      ? "Added"
                      : "Add"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </>
  );
}

export default AdditionalService;
