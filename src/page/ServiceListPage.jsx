import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Filter from "@/components/ServiceList/Filter";
import ServiceList from "@/components/ServiceList/ServiceList";
import { useGetServicesQuery } from "@/redux/api/serviceApi";

function ServiceListPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const { data, isLoading } = useGetServicesQuery({
    pageIndex: 1,
    pageSize: 100,
  });
  if (isLoading) return null;
  console.log({data});
  
  return (
    <>
      {/* Hero */}
      <div className="relative bg-[url(/cleaning-service.jpg)] bg-cover bg-center min-h-[400px] flex items-center md:mt-20 before:absolute before:inset-0 before:bg-black/0 dark:before:bg-black/40">
        <div className="relative lg:mx-16 lg:mb-24">
          <h1 className="text-2xl lg:text-4xl text-black dark:text-white font-bold">
            Book today – A clean home, a peaceful mind!
          </h1>
          <div className="mt-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="dark:text-white hover:text-black">
                  <Link className="text-lg" to="/">
                    Home
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="dark:text-white hover:text-black">
                  <Link className="text-lg" to="/service">
                    Category
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-lg">Services</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="flex flex-col lg:flex-row justify-center mt-14 container mx-auto gap-4 px-6 lg:px-16">
        {/* Bộ lọc (Filter) */}
        <div className="w-full lg:w-80 shadow-lg rounded-md shrink-0 h-fit">
          <Filter />
        </div>

        {/* Danh sách dịch vụ */}
        <div className="w-full">
          <ServiceList services={data.data.items} />
        </div>
      </div>
    </>
  );
}

export default ServiceListPage;
