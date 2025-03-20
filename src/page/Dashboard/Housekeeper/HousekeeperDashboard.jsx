import React from "react";
import { Separator } from "@/components/ui/separator";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Users,
  ListChecks,
  Clock,
  DollarSign,
  User,
  Calendar,
  MapPin,
  Mail,
  X,
  RefreshCcw,
} from "lucide-react";
import { useGetBookingCountHousekeeperQuery } from "@/redux/api/bookingApi";
import RevenueChart from "@/components/HousekeeperDashboard/RevenueChart";
import TopService from "@/components/HousekeeperDashboard/TopService";
const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

function HousekeeperDashboard() {
  const { data: bookingStats, isLoading } = useGetBookingCountHousekeeperQuery();
  const stats = bookingStats?.data || {
    upcomingBookings: 0,
    completedBookings: 0,
    canceledBookings: 0,
    refundedBookings: 0
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Dashboard Header and Top Services Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Services - Takes 1 column on the left */}
        <div className="lg:col-span-1">
          <TopService />
        </div>

        {/* Dashboard Header Cards - Takes 2 columns on the right */}
        <div className="lg:col-span-2 grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Bookings
              </CardTitle>
              <Clock className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
              <p className="text-xs text-muted-foreground">
                Pending appointments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Bookings
              </CardTitle>
              <ListChecks className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedBookings}</div>
              <p className="text-xs text-muted-foreground">
                Successfully completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Canceled Bookings
              </CardTitle>
              <X className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.canceledBookings}</div>
              <p className="text-xs text-muted-foreground">
                Canceled appointments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Refunded Bookings
              </CardTitle>
              <RefreshCcw className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.refundedBookings}</div>
              <p className="text-xs text-muted-foreground">
                Refunded appointments
              </p>
            </CardContent>
          </Card>
          {/* Overview Statistics */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Order Value
              </CardTitle>
              <DollarSign className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.ceil(stats.averagePrice)}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Revenue Chart */}
      <RevenueChart />
    </div>
  );
}

export default HousekeeperDashboard;
