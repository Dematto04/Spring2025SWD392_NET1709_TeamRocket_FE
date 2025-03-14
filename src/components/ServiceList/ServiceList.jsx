import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ServiceItem from "./ServiceItem";
import { useSearchParams } from "react-router-dom";
import { useGetServicesQuery } from "@/redux/api/serviceApi";
import LoadingScreen from "../Loading";

function ServiceList() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const { data, isLoading, isError, isSuccess } = useGetServicesQuery({
    pageIndex: 1,
    pageSize: 100,
  });
  if (isLoading) return <LoadingScreen />;

  return (
    isSuccess && (
      <div className="">
        {/* header */}
        <div className="flex justify-between items-center p-4 w-full">
          <div className="text-xl font-bold">
            Found <span className="text-primary">11 Services</span>
          </div>
          <div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Price High to Low" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Price High to Low</SelectItem>
                <SelectItem value="asc">Price Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* service list */}
        <div className="w-full grid md:grid-cols-2 xl:grid-cols-3 gap-y-6 gap-x-3">
          {/* service items */}
          {data?.data?.items.map((item, idx) => (
            <ServiceItem key={idx} service={item} />
          ))}
        </div>
      </div>
    )
  );
}

export default ServiceList;
