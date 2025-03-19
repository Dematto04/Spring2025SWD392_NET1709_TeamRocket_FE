import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function MobileView({registrations, categoriesData}) {
    const navigate = useNavigate()      
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
          case "pending":
            return "bg-yellow-500";
          case "approved":
            return "bg-green-500";
          case "rejected":
            return "bg-red-500";
          default:
            return "bg-gray-500";
        }
      };
    
      const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
          case "pending":
            return "Pending Review";
          case "approved":
            return "Approved";
          case "rejected":
            return "Rejected";
          default:
            return status;
        }
      };
    
      const getCategoryName = (categoryId) => {
        console.log(categoriesData.data);
        return (
          categoriesData?.data?.find((cat) => cat.id === categoryId)?.name ||
          categoryId
        );
      };
  return (
    <div className="md:hidden space-y-4">
    {registrations.map((registration) => (
      <div
        key={registration.housekeeper_id}
        className="rounded-lg shadow p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={registration.avatar} />
              <AvatarFallback>
                {registration.full_name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">
                {registration.full_name}
              </h3>
              <p className="text-sm text-gray-500">
                {registration.email}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(registration.status)}>
            {getStatusText(registration.status)}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Categories</p>
            <div className="flex flex-wrap gap-1">
              {registration.categories.map((categoryId) => (
                <Badge
                  key={categoryId}
                  variant="secondary"
                  className="text-xs"
                >
                  {getCategoryName(categoryId)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            navigate(
              `/dashboard/staff/register-approve/${registration.housekeeper_id}`
            )
          }
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </div>
    ))}
  </div>
  )
}

export default MobileView
