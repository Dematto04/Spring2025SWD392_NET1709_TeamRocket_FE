import RequestPendingService from "@/components/Staff/RequestPendingService";
import ApprovedServiceRequest from "@/components/Staff/ApprovedServiceRequest";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { CalendarCheck2, ClipboardCheck, UserCheck2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function StaffRequestsPage() {
  const [pendingServiceCount, setPendingServiceCount] = useState(0);
  const [approvedServiceCount, setApprovedServiceCount] = useState(0);

  const updatePendingCount = (count) => {
    setPendingServiceCount(count);
  };

  const updateApprovedCount = (count) => {
    setApprovedServiceCount(count);
  };

  return (
    <Card className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-xl font-semibold">Staff Request Management</h1>
      </div>

      <Tabs defaultValue="pending-services" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full max-w-2xl">
          <TabsTrigger
            value="pending-services"
            className="flex items-center space-x-2"
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Pending Requests</span>
            {pendingServiceCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 border-amber-300 ml-2"
              >
                {pendingServiceCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="approved-requests"
            className="flex items-center space-x-2"
          >
            <CalendarCheck2 className="h-4 w-4" />
            <span>Approved Services</span>
            {approvedServiceCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 border-green-300 ml-2"
              >
                {approvedServiceCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending-services" className="space-y-4">
          <RequestPendingService onCountUpdate={updatePendingCount} />
        </TabsContent>

        <TabsContent value="approved-requests">
          <ApprovedServiceRequest onCountUpdate={updateApprovedCount} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function ApprovedRequestsPlaceholder() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-5 w-48" />
                <div className="flex items-center mt-2 space-x-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-64 mt-2" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </Card>
        ))}
    </div>
  );
}
