import ServiceBook from "@/components/ServiceBook/ServiceBook";
import ServiceBookProvider, {
  ServiceBookContext,
} from "@/components/ServiceBook/ServiceBookContext";
import ServiceBookingSidebar from "@/components/ServiceBook/ServiceBookingSidebar";
import { useGetServicesDetailQuery } from "@/redux/api/serviceApi";
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { useParams, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ServiceBookingSkeleton = () => (
  <div className="w-full bg-background flex-wrap md:flex-nowrap flex items-start p-4 rounded-xl gap-6">
    {/* Sidebar Skeleton */}
    <Card className="w-56 rounded-lg">
      <CardHeader className="p-4">
        <Skeleton className="h-6 w-32" />
        <div className="mt-4">
          <Skeleton className="h-24 w-full" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              {i !== 3 && <Skeleton className="h-8 w-[2px] ml-[6.5px]" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Main Content Skeleton */}
    <div className="flex-1 h-full p-4 rounded-lg">
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
      <Separator className="mt-16 mb-8" />
      <div className="flex justify-end gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  </div>
);

const ServiceBookingError = ({ error }) => (
  <div className="w-full bg-background p-4 rounded-xl">
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error?.data?.message || "Failed to load service details. Please try again later."}
      </AlertDescription>
    </Alert>
  </div>
);

function ServiceBookingContent() {
  const { step, setStep } = useContext(ServiceBookContext);
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetServicesDetailQuery(id);

  if (isLoading) return <ServiceBookingSkeleton />;
  if (isError) return <ServiceBookingError error={error} />;
  if (!data) return <Navigate to="/service" />;

  return (
    <div className="w-full bg-background flex-wrap md:flex-nowrap flex items-start p-4 rounded-xl gap-6">
      <ServiceBookingSidebar step={step} service={data?.data} />
      <ServiceBook setStep={setStep} step={step} />
    </div>
  );
}

function ServiceBookingPage() {
  return (
    <ServiceBookProvider>
      <div className="w-full min-h-screen bg-secondary mb-48">
        <div className="container mx-auto px-6 lg:px-16 h-full py-40">
          <ServiceBookingContent />
        </div>
      </div>
    </ServiceBookProvider>
  );
}

export default ServiceBookingPage;
