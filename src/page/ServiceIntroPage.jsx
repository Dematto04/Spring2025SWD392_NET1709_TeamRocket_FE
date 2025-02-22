import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import Paragraph from "@/components/Typo/Paragraph";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
  useGetServicesDetailQuery,
  useGetServicesPriceQuery,
} from "@/redux/api/serviceApi";
import { Card, CardContent } from "@/components/ui/card";

const benefitsList = [
  {
    title: "Experienced and Trusted Team",
    description:
      "Our cleaners are fully trained, background-checked, and committed to delivering exceptional results.",
  },
  {
    title: "Eco-Friendly Cleaning Products",
    description:
      "We use non-toxic, environmentally friendly products to ensure the safety of your family and pets.",
  },
  {
    title: "Flexible Scheduling",
    description:
      "Book our services at your convenience – whether it's a one-time deep clean or regular maintenance.",
  },
  {
    title: "Satisfaction Guaranteed",
    description:
      "If you're not satisfied with our service, we’ll make it right – no questions asked.",
  },
  {
    title: "Affordable Pricing",
    description:
      "High-quality cleaning services at competitive prices, with no hidden fees.",
  },
];

export default function ServiceIntroPage() {
  const { name, id } = useParams();
  const { data: service, isLoading } = useGetServicesDetailQuery(id);
  const { data: prices, isLoading: isPricesLoading } =
    useGetServicesPriceQuery(id);
  console.log({ prices });

  return (
    !isLoading && (
      <>
        {/* Hero Section */}
        <div className="relative bg-[url(/cleaning-service.jpg)] bg-cover bg-center min-h-[600px] flex items-center md:mt-20 before:absolute before:inset-0 before:bg-black/0 dark:before:bg-black/40">
          <div className="relative lg:mx-16 lg:mb-24">
            <div className="flex items-center gap-4 font-medium lg:pb-5">
              <div className="text-xl text-black dark:text-white">Service</div>
            </div>
            <h1 className="text-3xl lg:text-5xl text-black dark:text-white font-bold">
              {service.data.name}
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
                      Service
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-lg">
                      {service.data.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
        {/* Why Choose Our Residential Cleaning Services? */}
        <div className="flex flex-wrap md:flex-nowrap gap-9 container mx-auto px-6 lg:px-16 my-28">
          <div className="md:w-1/2">
            <p className="text-gray-500">{service.data.description}</p>
            <Separator className="w-4/5 mt-8" />
            <h2 className="mt-8 text-3xl font-medium">
              What will{" "}
              <span className="text-primary font-extrabold">
                {service.data.name}
              </span>{" "}
              do?
            </h2>
            <ul className="mt-8 space-y-3">
              {service?.data?.steps.map((item, index) => (
                <li
                  key={index}
                  className="flex gap-x-3 justify-start items-start"
                >
                  <div className="w-4 font-medium text-gray-500">
                    {item.stepOrder}.
                  </div>
                  <div className="font-medium text-gray-500">
                    {item.description}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:w-1/2 bg-primary p-10 rounded-3xl ">
            <h2 className="text-3xl font-medium text-white">
              Why Choose Our Residential Cleaning Services?
            </h2>
            <ul className="mt-8 space-y-5">
              {benefitsList.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start justify-start gap-3 text-white"
                >
                  <p>{index + 1}. </p>
                  <div>
                    <span className="font-semibold">{benefit.title}: </span>
                    <span>{benefit.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {prices?.data && (
          <div className="bg-secondary min-h-96 p-24">
            <h2 className="text-3xl font-medium mb-4">Price List</h2>
            {prices.data.length > 0 ? (
              <div className="container mx-auto px-6 lg:px-16 flex justify-center">
                <Carousel opts={{ align: "start" }} className="w-full">
                  <CarouselContent>
                    {prices.data.map((item, index) => (
                      <CarouselItem
                        key={index}
                        className={`md:basis-1/2 lg:basis-1/${prices.data.length}`}
                      >
                        <div className="p-2">
                          <Card>
                            <CardContent className="p-4">
                              <h3 className="text-xl font-semibold text-center mb-2">
                                {item.cleaningMethod}
                              </h3>
                              <div className="space-y-2">
                                {item.variants.map((variant, vIndex) => (
                                  <div
                                    key={vIndex}
                                    className="border p-2 rounded-lg"
                                  >
                                    <h4 className="font-medium">
                                      {variant.optionName}
                                    </h4>
                                    <ul className="mt-1 space-y-1">
                                      {variant.prices.map((price, pIndex) => (
                                        <li
                                          key={pIndex}
                                          className="flex justify-between text-sm"
                                        >
                                          <span>{price.optionValue}</span>
                                          <span className="font-semibold">
                                            ${price.price}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            ) : (
              <div className="container mx-auto px-6 lg:px-16 flex justify-center">
                {" "}
                <h3 className="text-xl font-semibold text-center mb-2">
                  Updating...
                </h3>
              </div>
            )}
          </div>
        )}
      </>
    )
  );
}
