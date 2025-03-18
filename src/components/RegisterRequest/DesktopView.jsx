import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

function DesktopView({registrations, categoriesData}) {
    
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
    <div className="hidden md:block">
    <div className="rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((registration) => (
            <TableRow key={registration.housekeeper_id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={registration.avatar} />
                    <AvatarFallback>
                      {registration.full_name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {registration.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {registration.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>
                <Badge
                  className={getStatusColor(registration.status)}
                >
                  {getStatusText(registration.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(
                      `/dashboard/staff/register-approve/${registration.housekeeper_id}`
                    )
                  }
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
  )
}

export default DesktopView
