import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import Header1 from "../Typo/Header1";
import Paragraph from "../Typo/Paragraph";
const clients = [
  {
    name: "Tom Baker",
    title: "Restaurant Owner",
  },
  {
    name: "Jennie Smith",
    title: "Coffee Shop Owner",
  },
  {
    name: "Jaden Paden",
    title: "Clothing Owner",
  },
];
export function HomeFeedback() {
  return (
    <section className="flex items-center flex-col justify-center p-3 lg:p-24 bg-[url('/testimonial-bg-01.png')] bg-center ">
      <Header1>What Our Client Says</Header1>
      <Paragraph className="mt-5">Content</Paragraph>
      <Carousel
        className="w-full max-w-5xl mt-20"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 2000
          }),
        ]}
      >
        <CarouselContent className="-ml-1">
          {clients.map((client, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/2"
            >
              <div className="p-1">
                <Card className="relative ">
                  <CardHeader className=" justify-center items-center">
                    <Avatar className="size-28">
                      <AvatarImage src={`/client-${index + 1}.jpg`} />
                    </Avatar>
                  </CardHeader>
                  <CardContent className="flex items-start justify-center p-6 h-fit">
                    <p className="text-gray-500 text-center">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Iure amet aliquam sit vitae nostrum consectetur. Lorem,
                      ipsum dolor sit amet consectetur adipisicing elit.
                      Reiciendis dolores excepturi beatae vitae deleniti.
                    </p>
                  </CardContent>
                  <CardFooter className="justify-center flex-col">
                    <div className="text-xl">{client.name}</div>
                    <p className="text-sm mt-1 text-gray-500 font-medium">
                      {client.title}
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
