import { Edit, Trash2, Star, ImageIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "success";
    case "Pending":
      return "warning";
    case "Rejected":
      return "destructive";
    default:
      return "secondary";
  }
};

const MyServiceCard = ({ service }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Link
              to={`/dashboard/housekeeper/my-service/${service.service_id}`}
            >
              <CardTitle className="text-xl">{service.service_name}</CardTitle>
            </Link>
            <CardDescription>{service.description}</CardDescription>
          </div>
          <Badge variant={getStatusColor(service.service_status)}>
            {service.service_status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Image Gallery */}
        <div className="mb-4">
          {service.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 h-48">
              {service.images.slice(0, 2).map((image, index) => (
                <div
                  key={image.id}
                  className="relative h-full w-full overflow-hidden rounded-lg"
                >
                  <img
                    src={image.url}
                    alt={`Service ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
              {service.images.length > 2 && (
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary">
                    +{service.images.length - 2} more
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">{service.service_address}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bookings</p>
            <p className="font-medium">{service.number_of_booking} bookings</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rating</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium ml-1">
                  {service.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({service.number_of_rating} reviews)
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Images</p>
            <p className="font-medium">{service.images.length} photos</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link
            to={`/dashboard/housekeeper/update-service/${service.service_id}`}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </Button>
        {/* <Button variant="destructive" size="sm">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button> */}
      </CardFooter>
    </Card>
  );
};

export default MyServiceCard;
