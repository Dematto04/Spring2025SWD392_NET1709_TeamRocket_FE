import { useGetHousekeeperProfileQuery } from "@/redux/api/meApi";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { MapPin, Mail, Phone, Award, CreditCard, ZoomIn, X } from "lucide-react";

function ImageViewerDialog({ isOpen, onClose, imageUrl, alt }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80" />
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imageUrl}
              alt={alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

function HousekeeperProfileSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative">
          <div className="h-32 w-32 rounded-full bg-muted" />
          <div className="absolute bottom-0 right-0 transform translate-y-1/2 h-6 w-20 rounded-full bg-muted" />
        </div>
        <div className="text-center md:text-left space-y-2">
          <div className="h-8 w-48 bg-muted rounded-md" />
          <div className="h-4 w-40 bg-muted rounded-md" />
          <div className="h-4 w-32 bg-muted rounded-md" />
        </div>
      </div>

      {/* Address Information Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-muted rounded-md" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded-md" />
                <div className="h-4 w-full bg-muted rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-muted rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded-md" />
                <div className="w-full aspect-video bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HousekeeperProfile() {
  const { data, isLoading, isSuccess } = useGetHousekeeperProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });
  const [selectedImage, setSelectedImage] = useState(null);

  if (isLoading) {
    return <HousekeeperProfileSkeleton />;
  }

  return (
    isSuccess && (
      <div className="container mx-auto p-4 space-y-6 max-w-4xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-center bg-card p-6 rounded-xl shadow-sm">
          <div className="relative">
            <img
              src={data?.data?.avatar}
              alt={data?.data?.full_name}
              className="h-32 w-32 rounded-full object-cover border-4 border-primary/20 shadow-lg hover:border-primary/40 transition-all duration-300"
            />
            <Badge
              variant="default"
              className="absolute bottom-0 right-0 transform translate-y-1/2 px-4 py-1 shadow-md"
            >
              {data?.data?.housekeeper_status}
            </Badge>
          </div>
          <div className="text-center md:text-left space-y-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {data?.data?.full_name}
            </h1>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{data?.data?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{data?.data?.phone_number}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                <p className="text-sm font-medium text-muted-foreground">
                  Address Line
                </p>
                <p className="mt-1">{data?.data?.housekeeper_address_line}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                <p className="text-sm font-medium text-muted-foreground">
                  City
                </p>
                <p className="mt-1">{data?.data?.housekeeper_city}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                <p className="text-sm font-medium text-muted-foreground">
                  District
                </p>
                <p className="mt-1">{data?.data?.housekeeper_district}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                <p className="text-sm font-medium text-muted-foreground">
                  Address Title
                </p>
                <p className="mt-1">{data?.data?.housekeeper_address_title}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Verification Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 group">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Certificate
                </p>
                <button 
                  className="relative w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setSelectedImage({
                    url: data?.data?.certificate_picture,
                    alt: "Certificate"
                  })}
                >
                  <img
                    src={data?.data?.certificate_picture}
                    alt="Certificate"
                    className="w-full aspect-video object-cover rounded-lg cursor-zoom-in transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </button>
              </div>
              <div className="space-y-2 group">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  ID Card (Front)
                </p>
                <button 
                  className="relative w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setSelectedImage({
                    url: data?.data?.id_card_front,
                    alt: "ID Card Front"
                  })}
                >
                  <img
                    src={data?.data?.id_card_front}
                    alt="ID Card Front"
                    className="w-full aspect-video object-cover rounded-lg cursor-zoom-in transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </button>
              </div>
              <div className="space-y-2 group">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  ID Card (Back)
                </p>
                <button 
                  className="relative w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setSelectedImage({
                    url: data?.data?.id_card_back,
                    alt: "ID Card Back"
                  })}
                >
                  <img
                    src={data?.data?.id_card_back}
                    alt="ID Card Back"
                    className="w-full aspect-video object-cover rounded-lg cursor-zoom-in transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Viewer Dialog */}
        <ImageViewerDialog
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage?.url}
          alt={selectedImage?.alt}
        />
      </div>
    )
  );
}

export default HousekeeperProfile;
