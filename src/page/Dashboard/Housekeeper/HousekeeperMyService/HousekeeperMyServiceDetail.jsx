import { useGetServicesDetailQuery } from '@/redux/api/serviceApi'
import React from 'react'
import { useParams, Link, data } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, DollarSign, ListChecks, Calendar, Star, User, Edit2, Phone, Mail } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { minuteHandle } from '@/lib/utils'

function ServiceDetailSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative">
          <div className="h-32 w-32 rounded-lg bg-muted" />
          <div className="absolute bottom-0 right-0 transform translate-y-1/2 h-6 w-20 rounded-full bg-muted" />
        </div>
        <div className="text-center md:text-left space-y-2">
          <div className="h-8 w-48 bg-muted rounded-md" />
          <div className="h-4 w-40 bg-muted rounded-md" />
          <div className="h-4 w-32 bg-muted rounded-md" />
        </div>
      </div>

      {/* Housekeeper Info Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-muted rounded-md" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-48 bg-muted rounded-md" />
              <div className="h-4 w-32 bg-muted rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Info Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-muted rounded-md" />
        </CardHeader>
        <CardContent className="space-y-4">
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

      {/* Steps Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-muted rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function HousekeeperMyServiceDetail() {
  const { id } = useParams()
  const { data: service, isLoading } = useGetServicesDetailQuery(id)
  console.log({service});
  

  if (isLoading) {
    return <ServiceDetailSkeleton />
  }

  if (!service?.data) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-semibold text-muted-foreground">Service not found</h2>
      </div>
    )
  }

  const serviceData = service.data

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-center bg-card p-6 rounded-xl shadow-sm">
        <div className="relative">
          <img
            src={serviceData.images?.[0]?.url || "/placeholder-service.jpg"}
            alt={serviceData.name}
            className="h-32 w-32 rounded-lg object-cover"
          />
          <Badge
            variant="default"
            className="absolute bottom-0 right-0 transform translate-y-1/2 px-4 py-1 shadow-md"
          >
            {serviceData.numOfBooks} Bookings
          </Badge>
        </div>
        <div className="text-center md:text-left space-y-3 flex-1">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {serviceData.name}
            </h1>
            <Button asChild variant="outline" size="sm">
              <Link to={`/dashboard/housekeeper/update-service/${id}`}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Service
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>${serviceData.price}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="w-4 h-4" />
              <span>{serviceData.reviews || 0} ({serviceData.numOfReviews || 0} reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{serviceData.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Housekeeper Information */}
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Housekeeper Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={serviceData.housekeeper.avatar} />
                <AvatarFallback>
                  {serviceData.housekeeper.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{serviceData.housekeeper.name}</h3>
                <p className="text-sm text-muted-foreground">{serviceData.housekeeper.numOfServices} Services</p>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{serviceData.housekeeper.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{serviceData.housekeeper.mobile}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{serviceData.housekeeper.address}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Overview */}
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary" />
            Service Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-sm font-medium text-muted-foreground">Overview</p>
              <p className="mt-1">{serviceData.overview}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p className="mt-1">{serviceData.location}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-sm font-medium text-muted-foreground">Price</p>
              <p className="mt-1">${serviceData.price}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
              <p className="mt-1">{serviceData.numOfBooks}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Steps */}
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary" />
            Service Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceData.steps?.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{step.name}</p>
                  <p className="text-sm text-muted-foreground">{minuteHandle(step.duration)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Services */}
      {serviceData.additionalServices && serviceData.additionalServices.length > 0 && (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-primary" />
              Additional Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceData.additionalServices.map((service, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card">
                  <div className="flex gap-4">
                    <img
                      src={service.url}
                      alt={service.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-primary font-medium">${service.price}</span>
                        <span className="text-sm text-muted-foreground">{minuteHandle(service.duration)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Rules */}
      {serviceData.rules && serviceData.rules.length > 0 && (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Distance Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceData.rules.map((rule, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/30">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Distance Range</p>
                      <p className="text-sm font-medium text-primary">${rule.fee}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm">
                        {rule.min} - {rule.max} km
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Images */}
      {serviceData.images && serviceData.images.length > 0 && (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Service Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceData.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Service image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default HousekeeperMyServiceDetail