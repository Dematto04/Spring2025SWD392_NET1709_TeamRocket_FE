import BookNow from "@/components/Home/BookNow/BookNow";
import FAQ from "@/components/Home/FAQ/FAQ";
import Hero from "@/components/Home/Hero/Hero";
import HomeFeature from "@/components/Home/HomeFeature/HomeFeature";
import WhyChooseUs from "@/components/Home/WhyChooseUs/WhyChooseUs";
import { HomeFeedback } from "@/components/HomeFeedback/HomeFeedback";
import HowItWork from "@/components/HowItWork/HowItWork";
import React from "react";
import { useOutletContext } from "react-router-dom";
function HomePage() {
  const {services} = useOutletContext()


  return (
    <>
      <Hero />
      <HomeFeature services={services}/>
      <HomeFeedback/>
      <HowItWork/>
      <BookNow/>
      <WhyChooseUs/>
      <FAQ/>
    </>
  );
}

export default HomePage;
