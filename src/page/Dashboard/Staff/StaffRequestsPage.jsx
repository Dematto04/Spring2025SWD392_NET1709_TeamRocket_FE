import React, { useState } from 'react';
import { useGetPendingRequestQuery, useGetStaffApprovedRequestQuery } from '@/redux/api/requestApi';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function StaffRequestsPage() {
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const [activeTab, setActiveTab] = useState('pending');
  const itemsPerPage = 5;

  // Fetch pending requests
  const { data: pendingData, error: pendingError, isLoading: pendingIsLoading } = useGetPendingRequestQuery();

  // Fetch approved requests
  const { data: approvedData, error: approvedError, isLoading: approvedIsLoading } = useGetStaffApprovedRequestQuery();

  const renderRequestList = (requests, currentPage, setCurrentPage, totalPages) => {
    // Map requests to JSX elements
    const requestItems = requests.map((request) => {
      // Determine the status color scheme
      let statusStyles = '';
      switch (request.service_status.toLowerCase()) {
        case 'pending':
          statusStyles = 'bg-yellow-500 hover:bg-yellow-600';
          break;
        case 'active':
          statusStyles = 'bg-green-500 hover:bg-green-600';
          break;
        case 'rejected':
          statusStyles = 'bg-red-500 hover:bg-red-600';
          break;
        default:
          statusStyles = 'bg-gray-500 hover:bg-gray-600'; // Fallback for unknown status
      }

      return (
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

            <Button
              variant="success"
              className={`absolute top-4 right-4 ${statusStyles}`}
            >
              {request.service_status}
            </Button>
          </CardContent>
        </Card>
      );
    });

    // Single return for renderRequestList
    return (
      <div className="space-y-4">
        {requestItems.length > 0 ? (
          <>
            {requestItems}
            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                 Prev
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
                Next 
              </Button>
            </div>
          </>
        ) : (
          <div>No requests found.</div>
        )}
      </div>
    );
  };

  const pendingRequests = pendingData && pendingData.isSucceed ? pendingData.data : [];
  const approvedRequests = approvedData && approvedData.isSucceed ? approvedData.data : [];

  // Pagination logic for pending requests
  const totalPagesPending = Math.ceil(pendingRequests.length / itemsPerPage);
  const paginatedPendingRequests = pendingRequests.slice(
    (currentPagePending - 1) * itemsPerPage,
    currentPagePending * itemsPerPage
  );

  // Pagination logic for approved requests
  const totalPagesApproved = Math.ceil(approvedRequests.length / itemsPerPage);
  const paginatedApprovedRequests = approvedRequests.slice(
    (currentPageApproved - 1) * itemsPerPage,
    currentPageApproved * itemsPerPage
  );

  return (
    <div className="p-4">
      {(pendingIsLoading || approvedIsLoading) ? (
        <div>Loading...</div>
      ) : pendingError ? (
        <div>Error fetching pending requests: {pendingError.message}</div>
      ) : approvedError ? (
        <div>Error fetching approved requests: {approvedError.message}</div>
      ) : (
        <Tabs defaultValue="pending" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="approved">Approved Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {renderRequestList(paginatedPendingRequests, currentPagePending, setCurrentPagePending, totalPagesPending)}
          </TabsContent>

          <TabsContent value="approved">
            {renderRequestList(paginatedApprovedRequests, currentPageApproved, setCurrentPageApproved, totalPagesApproved)}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default StaffRequestsPage;