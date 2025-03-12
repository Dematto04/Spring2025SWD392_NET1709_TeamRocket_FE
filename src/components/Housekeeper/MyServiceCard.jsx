import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const MyServiceCard = ({service}) => {
  return (
    <div
      className="bg-background shadow-md rounded-lg overflow-hidden"
    >
      <img
        src={service.image}
        alt={service.title}
        className="w-full object-cover"
      />
      <div className="p-4">
        <span className="bg-primary-foreground text-primary px-2 py-1 text-xs rounded-md">
          {service.category}
        </span>
        <h2 className="font-semibold mt-2">{service.title}</h2>
        <p className="text-sm">{service.location}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-lg font-bold">
            ${service.price.toFixed(2)}
          </p>
        </div>
        {/* Buttons */}
        <div className="flex justify-between mt-4 text-sm">
          <Link to={"/dashboard/housekeeper/update-service/0d5234ee-21e7-4bd7-ad14-08dd5a0521f8"} className="flex items-center gap-1 text-primary">
            <Edit /> Edit
          </Link>
          <span
            className={`px-3 py-1 text-xs rounded-lg ${
              service.status === "Active"
                ? "bg-green-200 text-green-700"
                : service.status === "Pending"
                ? "bg-yellow-200 text-yellow-700"
                : "bg-red-200 text-red-700"
            }`}
          >
            {service.status}
          </span>
          <button className="flex items-center gap-1 text-red-500">
            <Trash2 /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyServiceCard;
