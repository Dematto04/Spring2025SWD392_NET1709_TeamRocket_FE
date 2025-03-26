import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock } from "lucide-react";
import { minuteHandle } from "@/lib/utils";

const defaultImages = [
  "https://source.unsplash.com/200x200/?cleaning",
  "https://source.unsplash.com/200x200/?washing",
  "https://source.unsplash.com/200x200/?household",
];

export default function ServiceDetailSteps({ data }) {
  const calculateTotal = (duration) => {
    if (!Array.isArray(duration) || duration.length === 0) return "N/A";

    const total = duration.reduce((acc, cur) => {
      const dur = cur.duration === "N/A" ? 0 : Number(cur.duration || 0);
      return acc + dur;
    }, 0);

    return total > 0 ? minuteHandle(total) : "N/A";
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-900">
      <CardHeader className="bg-blue-50 dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            What will{" "}
            <span className=" text-primary font-extrabold">
              {data?.data?.name}
            </span>{" "}
            do?
          </h2>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-lg font-medium">
              {calculateTotal(data?.data?.steps)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ul className="space-y-4">
          {data?.data?.steps?.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-lg shadow-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                  {item?.name}
                </p>
                <p className="text-md  flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 " />
                  Estimate:{" "}
                  {item?.duration === "N/A"
                    ? "N/A"
                    : minuteHandle(item?.duration)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
