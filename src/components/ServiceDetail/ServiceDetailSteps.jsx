import { Separator } from "@radix-ui/react-dropdown-menu";
import { CheckCircle, ChevronRight } from "lucide-react";

const defaultImages = [
  "https://source.unsplash.com/200x200/?cleaning", // Random cleaning-related images
  "https://source.unsplash.com/200x200/?washing",
  "https://source.unsplash.com/200x200/?household"
];

export default function ServiceDetailSteps({ data }) {
    console.log(data);
    
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-6 items-start">
      <div className="w-full">
        <Separator className="w-4/5 mt-4" />
        <h2 className="mt-4 text-3xl font-semibold leading-tight">
          What will{" "}
          <span className="text-primary font-extrabold">
            {data?.data.name}
          </span>{" "}
          do?
        </h2>
        <ul className="mt-4 space-y-4">
          {data?.data?.steps?.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-x-4 p-4 rounded-lg bg-gray-100 shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-blue-500 text-white font-semibold text-lg shadow">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={18} />
                  {item}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
