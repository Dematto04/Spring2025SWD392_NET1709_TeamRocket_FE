import BookNow from "@/components/Home/BookNow/BookNow";
import FAQ from "@/components/Home/FAQ/FAQ";
import Hero from "@/components/Home/Hero/Hero";
import HomeFeature from "@/components/Home/HomeFeature/HomeFeature";
import WhyChooseUs from "@/components/Home/WhyChooseUs/WhyChooseUs";
import { HomeFeedback } from "@/components/HomeFeedback/HomeFeedback";
import HowItWork from "@/components/HowItWork/HowItWork";
import React from "react";
function HomePage() {
  return (
    <>
      <Hero />
      <HomeFeature/>
      <HomeFeedback/>
      <HowItWork/>
      <BookNow/>
      <WhyChooseUs/>
      <FAQ/>
    </>
  );
}

export default HomePage;
