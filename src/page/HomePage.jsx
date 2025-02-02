import Hero from "@/components/Home/Hero/Hero";
import HomeFeature from "@/components/Home/HomeFeature/HomeFeature";
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
    </>
  );
}

export default HomePage;
