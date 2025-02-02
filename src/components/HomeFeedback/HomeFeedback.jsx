import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

export function HomeFeedback() {
  return (
    <section className="flex items-center justify-center">
      <Carousel className="w-full max-w-sm">
        <CarouselContent className="-ml-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/2"
            >
              <div className="p-1">
                <Card>
                    <CardHeader className="justify-center items-center">
                        <Avatar className="size-20">
                            <AvatarImage src={`/client-${index + 1}.jpg`}/>
                        </Avatar>
                    </CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    
                  </CardContent>
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
