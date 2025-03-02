import React, { useState } from 'react';
import { useGetPendingRequestQuery } from '@/redux/api/requestApi';
import { Card, CardContent } from "@/components/ui/card"; // Adjust import paths as needed
import { Badge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function StaffRequestsPage() {
  const { data, error, isLoading } = useGetPendingRequestQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const requests = data && data.isSucceed ? data.data : [];
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const paginatedRequests = requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleViewDetails = (requestId) => {
    // Handle view details logic
    console.log('View details for request:', requestId);
  };

  return (
    <div className="p-4">
      {/* Request List */}
      <div className="space-y-4">
        {paginatedRequests.map((request) => (
          <Card key={request.service_id} className="overflow-hidden">
            <CardContent className="p-4 flex gap-4 relative">
              <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={request.serviceImages[0]?.link || "/placeholder.svg"}
                  alt={request.service_name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-semibold">{request.service_name}</h2>
                  <Badge variant={request.service_status === "Pending" ? "destructive" : "success"}>
                    {request.service_status}
                  </Badge>
                </div>

                <div className="grid gap-1 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-500">Request Date</span>
                    <span className="flex-1">
                      : {new Date(request.created_time).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-500">Time</span>
                    <span className="flex-1">
                      : {request.serviceTimeSlots[0]?.start_time} - {request.serviceTimeSlots[0]?.end_time}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-500">Amount</span>
                    <span className="flex-1">: ${request.service_price}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-500">Location</span>
                    <span className="flex-1">: {request.service_city}, {request.service_district}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-500">Provider</span>
                    <span className="flex-1">: {request.user_name}</span>
                  </div>
                </div>

                <Link to={`/request/${request.service_id}`}>
                <span className="text-lg">🔍</span> View Details
                </Link>
                
              </div>

                <Button variant="success" className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">
                  Pending
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          &lt; Prev
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? "default" : "outline"}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next &gt;
        </Button>
      </div>
    </div>
  );
}

export default StaffRequestsPage;