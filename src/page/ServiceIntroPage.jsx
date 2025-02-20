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
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const serviceList = [
  "Dusting surfaces, furniture, and décor",
  "Vacuuming and mopping floors",
  "Wiping down countertops and tabletops",
  "Cleaning bathrooms, including sinks, toilets, and showers",
  "Cleaning and sanitizing bathrooms (toilets, sinks, showers, tubs)",
  "Cleaning and sanitizing kitchen surfaces (stovetops, sinks, and appliances)",
  "Cleaning mirrors and glass surfaces",
];

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
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-[url(/cleaning-service.jpg)] bg-cover bg-center min-h-[600px] flex items-center md:mt-20 before:absolute before:inset-0 before:bg-black/0 dark:before:bg-black/40">
        <div className="relative lg:mx-16 lg:mb-24">
          <div className="flex items-center gap-4 font-medium lg:pb-5">
            <div className="text-xl text-black dark:text-white">Service</div>
          </div>
          <h1 className="text-3xl lg:text-5xl text-black dark:text-white font-bold">
            Home Cleaning
          </h1>
          <div className="mt-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="dark:text-white hover:text-black">
                    <Link className="text-lg" to="/">
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="dark:text-white hover:text-black">
                    <Link className="text-lg" to="/components">
                      Components
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-lg">
                    Breadcrumb
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
          <p className="text-gray-500">
            Life is busy, and your time is precious. Let us take care of the
            cleaning so you can enjoy a fresh, spotless living space without the
            hassle. Our residential cleaning services are tailored to fit your
            unique needs, delivering the highest standards of cleanliness and
            care.
          </p>
          <Separator className="w-4/5 mt-8" />
          <h2 className="mt-8 text-3xl font-medium">
            Home Cleaning Service List
          </h2>
          <ul className="mt-8 space-y-3">
            {serviceList.map((item, index) => (
              <li key={index} className="flex gap-3 items-center">
                <Check className="text-primary" strokeWidth={5} size={16} />
                <span className="font-medium text-gray-500">{item}</span>
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
      <div className="bg-secondary min-h-96 p-24">
        <div className="container mx-auto px-6 lg:px-16">
          <h2 className="text-3xl font-medium">
            Our Comprehensive Cleaning Services Include
          </h2>
        </div>
      </div>
    </>
  );
}
