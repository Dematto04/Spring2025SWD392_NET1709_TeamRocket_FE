import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  Star,
  AlertCircle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Clock,
  Calendar1Icon
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import RevenueChart from "@/components/AdminDashboard/RevenueChart";
import React from "react";
import ServiceDistribution from "@/components/AdminDashboard/ServiceDistribution";
const DatePickerTrigger = React.forwardRef(({ children, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[150px] cursor-pointer"
  >
    {children}
  </div>
));
DatePickerTrigger.displayName = "DatePickerTrigger";

export function DashboardAdmin() {
  

  // Example data - replace with actual API data
  const stats = {
    totalUsers: {
      value: 1234,
      trend: 12.5,
      isPositive: true
    },
    activeServices: {
      value: 89,
      trend: 8.2,
      isPositive: true
    },
    monthlyRevenue: {
      value: 45600,
      trend: -2.4,
      isPositive: false
    },
    averageRating: {
      value: 4.5,
      trend: 0.3,
      isPositive: true
    }
  };


  const renderTrendIndicator = (trend, isPositive) => (
    <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      {Math.abs(trend)}%
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-gray-50/50">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, Admin</p>
        </div>
        <Button className="bg-primary/90 hover:bg-primary">
          Download Report
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">{stats.totalUsers.value}</h3>
                  {renderTrendIndicator(stats.totalUsers.trend, stats.totalUsers.isPositive)}
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Progress value={75} className="mt-4 h-1 bg-blue-100 [&>div]:bg-blue-600" />
          </CardContent>
        </Card>

        {/* Similar cards for other stats... */}
        {/* Active Services */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Services
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">{stats.activeServices.value}</h3>
                  {renderTrendIndicator(stats.activeServices.trend, stats.activeServices.isPositive)}
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <Progress value={60} className="mt-4 h-1 bg-purple-100 [&>div]:bg-purple-600" />
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Monthly Revenue
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">
                    ${stats.monthlyRevenue.value.toLocaleString()}
                  </h3>
                  {renderTrendIndicator(stats.monthlyRevenue.trend, stats.monthlyRevenue.isPositive)}
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={85} className="mt-4 h-1 bg-green-100 [&>div]:bg-green-600" />
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">{stats.averageRating.value}/5</h3>
                  {renderTrendIndicator(stats.averageRating.trend, stats.averageRating.isPositive)}
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <Progress value={90} className="mt-4 h-1 bg-yellow-100 [&>div]:bg-yellow-600" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update Revenue Chart */}
        <RevenueChart/>

        {/* Service Distribution */}
        <ServiceDistribution/>
      </div>

      {/* Recent Activity */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {/* <Calendar className="h-5 w-5 text-primary" /> */}
            Recent Activity
          </CardTitle>
          <CardDescription>Latest updates and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${activity.iconBg}`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


const recentActivities = [
  {
    icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    iconBg: 'bg-green-100',
    title: 'New Service Completed',
    description: 'House cleaning service completed by John Doe',
    time: '2 mins ago'
  },
  {
    icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
    iconBg: 'bg-orange-100',
    title: 'New Service Request',
    description: 'Plumbing service requested in Brooklyn area',
    time: '5 mins ago'
  },
  // Add more activities as needed
];

export default DashboardAdmin;
