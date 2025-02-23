import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
  import { Link } from "react-router-dom";
function ServiceDetailHero() {
  return (
    <>
      <div className="relative bg-[url(/cleaning-service.jpg)] bg-cover bg-center min-h-[400px] flex items-center md:mt-20 before:absolute before:inset-0 before:bg-black/0 dark:before:bg-black/40">
        <div className="relative px-4 lg:mx-16 lg:mb-24">
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
                <BreadcrumbItem className="dark:text-white hover:text-black">
                  <Link className="text-lg" to="/services">
                    Services
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-lg">Services Detail</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceDetailHero;
