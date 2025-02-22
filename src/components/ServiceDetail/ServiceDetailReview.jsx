import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, ThumbsDown, MessageSquareDiff } from "lucide-react";

const reviews = [
  {
    name: "Adrian Hendriques",
    time: "2 days ago",
    rating: 5,
    text: "The electricians were prompt, professional, and resolved our issues quickly. Did a fantastic job upgrading our electrical panel. Highly recommend them for any electrical work.",
    likes: 45,
    dislikes: 21,
    replies: [
      {
        name: "Stephen Vance",
        time: "2 days ago",
        rating: 4,
        text: "Thank You!!! For Your Appreciation!!!",
        likes: 45,
        dislikes: 20,
      },
    ],
  },
];

const ratings = [
  { stars: 5, count: 2547 },
  { stars: 4, count: 1245 },
  { stars: 3, count: 600 },
  { stars: 2, count: 560 },
  { stars: 1, count: 400 },
];

export default function ServiceDetailReview() {
  return (
    <div className="mt-8 mb-20">
      <div className="text-2xl font-semibold">Reviews (45)</div>
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <Card className="p-4 flex-1 space-y-3 text-center">
          <div className="text-2xl text-center font-bold text-primary">
            Customer Reviews & Ratings
          </div>
          <div className="flex items-center justify-center gap-1 mt-2 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <div>(4.9 out of 5.0)</div>
          <div>Based On 2,459 Reviews</div>
        </Card>
        <div className="flex-1">
          {ratings.map(({ stars, count }) => (
            <div key={stars} className="flex items-center gap-2 mt-4">
              <div className="shrink-0 ">{stars} Star Ratings</div>
              <Progress value={(count / 2547) * 100} className="flex-grow" />
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="mt-8">
          <MessageSquareDiff />
          Write A Review
        </Button>
      </div>
      <div className="mt-6">
        {reviews.map((review, index) => (
          <Card key={index} className="p-4 mt-4">
            <div className="font-semibold flex items-center justify-between">
              <div>{review.name}</div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 font-bold">
                  ★ {review.rating}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {review.time} • Excellent service!
            </div>
            <p className="mt-2">{review.text}</p>
            <div className="flex items-center gap-2 mt-2 ">
              <ThumbsUp className="cursor-pointer" size={18} /> {review.likes}
              <ThumbsDown className="cursor-pointer" size={18} />{" "}
              {review.dislikes}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
