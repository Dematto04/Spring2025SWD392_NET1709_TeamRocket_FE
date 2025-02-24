import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

function ServiceDetailCarousel({ images }) {
  const [mainRef, mainApi] = useEmblaCarousel({ align: "start" });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!thumbApi) return;
    const onSelect = () => {
      const index = thumbApi.selectedScrollSnap();
      setSelectedIndex(index);
      mainApi?.scrollTo(index);
    };

    thumbApi.on("select", onSelect);
    return () => thumbApi.off("select", onSelect);
  }, [thumbApi, mainApi]);

  const scrollToIndex = useCallback(
    (index) => {
      mainApi?.scrollTo(index);
      thumbApi?.scrollTo(index);
      setSelectedIndex(index);
    },
    [mainApi, thumbApi]
  );

  return (
    <div className="flex flex-col items-center space-y-6 mt-2">
      {/* Main Carousel */}
      <div
        className=" lg:w-full overflow-hidden h-64 md:h-96 lg:h-[500px] pointer-events-none"
        ref={mainRef}
      >
        <div className="flex h-full">
          {images.length > 0 ? (
            images.map((src, index) => (
              <div key={index} className="h-full shrink-0 basis-full p-1">
                <img
                  src={src}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))
          ) : (
            <div className="h-full shrink-0 basis-full p-1">
              <img
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVNer1ZryNxWVXojlY9Hoyy1-4DVNAmn7lrg&s"
                }
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Carousel*/}
      <div className="w-full overflow-hidden relative" ref={thumbRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div
              key={index}
              className="flex-[0_0_20%] p-1 cursor-pointer"
              onClick={() => scrollToIndex(index)}
            >
              <div
                className={`border-[3px] h-full p-2 ${
                  selectedIndex === index
                    ? "border-primary "
                    : "border-transparent"
                } rounded-md overflow-hidden`}
              >
                <img src={src} className="w-full  h-full object-cover" />
              </div>
            </div>
          ))}
        </div>

        {/* Prev & Next Buttons */}
        <Button
          className="absolute h-8 w-8  rounded-full left-5 top-1/2 -translate-y-1/2"
          onClick={() => scrollToIndex(Math.max(0, selectedIndex - 1))}
        >
          <ArrowLeft className="h-5 w-5 " />
        </Button>

        <Button
          className="absolute h-8 w-8 rounded-full right-5 top-1/2 -translate-y-1/2"
          onClick={() =>
            scrollToIndex(Math.min(images.length - 1, selectedIndex + 1))
          }
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default ServiceDetailCarousel;
