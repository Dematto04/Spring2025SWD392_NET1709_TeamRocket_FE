import React from "react";
import "./booknow.css";
import Header1 from "@/components/Typo/Header1";
import { Button } from "@/components/ui/button";
import { CircleChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function BookNow() {
  return (
    <section className="booknow relative bg-primary min-h-[384px] flex justify-center items-center px-3 py-3 md:py-0">
      <div className="relative flex justify-start h-full w-full xl:w-2/3 z-[1]">
        <div className="hidden md:block flex-shrink-0 h-full self-end">
          <img src="/offer-image.png" alt="offer" className="" />
        </div>
        <div className="self-center">
          <Header1 className="text-primary-foreground">
            Make Your Home Fresh Now!
          </Header1>
          <div className="text-primary-foreground mt-8">
            Experience a spotless home with our professional cleaning services.
            Our trained housekeepers ensure a deep clean, giving you a healthier
            and more comfortable living space. Book now and enjoy a fresh start!
          </div>
          <Button variant="secondary" className="mt-8">
            <Link className="">
              <div className="flex items-center justify-center gap-3">
                <span>Make it Clean</span> <CircleChevronRight />
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default BookNow;
