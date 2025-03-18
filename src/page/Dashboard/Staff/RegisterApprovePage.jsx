import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';

function RegisterApprovePage() {
  const navigate = useNavigate();
  
  // Mock data - replace with actual API call
  const registrations = [
    {
      id: 1,
      fullName: "John Doe",
      email: "john@example.com",
      phone: "0123456789",
      status: "pending",
      submittedDate: "2024-03-15",
      avatar: "https://github.com/shadcn.png",
    },
    // Add more mock data as needed
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Housekeeper Registration Requests</h1>
        <div className="flex gap-2">
          <Button variant="outline">Filter</Button>
          <Button>Export</Button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {registrations.map((registration) => (
          <div
            key={registration.id}
            className="rounded-lg shadow p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={registration.avatar} />
                  <AvatarFallback>{registration.fullName.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{registration.fullName}</h3>
                  <p className="text-sm text-gray-500">{registration.email}</p>
                </div>
              </div>
              <Badge className={getStatusColor(registration.status)}>
                {getStatusText(registration.status)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Phone</p>
                <p>{registration.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Submitted</p>
                <p>{format(new Date(registration.submittedDate), 'MMM d, yyyy')}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(`/dashboard/staff/register-approve/${registration.id}`)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className=" rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={registration.avatar} />
                        <AvatarFallback>{registration.fullName.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{registration.fullName}</div>
                        <div className="text-sm text-gray-500">{registration.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{registration.phone}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(registration.status)}>
                      {getStatusText(registration.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(registration.submittedDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/dashboard/staff/register-approve/${registration.id}`)}
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
    </Card>
  );
}

export default RegisterApprovePage;
