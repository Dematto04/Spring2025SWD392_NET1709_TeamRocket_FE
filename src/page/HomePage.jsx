import Hero from "@/components/Home/Hero/Hero";
import HomeFeature from "@/components/Home/HomeFeature/HomeFeature";
import React from "react";
function HomePage() {
  const hehe = () => {
    console.log('hehe');
    
  }
  return (
    <>
      <Hero />
      <HomeFeature/>
    </>
  );
}

export default HomePage;
